
const config = require('../../config')
const { Vonage } = require('@vonage/server-sdk');

const vonage = new Vonage({
    applicationId: config.VIDEO.vonage.APP_ID,
    privateKey: config.VIDEO.vonage.PRIVATE_KEY_PATH,
});

/**
 * https://developer.vonage.com/en/tutorials/create-session/create-session-media-router/node
 * 
 * ROUTED:
 * - Audio stream are sent along with video.
 * - Automatically changes video server if the current one is not working fine.
 * - Supports archiving data (saving video and audio)
 * 
 * RELAYED:
 * - Audio stream are separated from video. Clients must subscribe to both.
 * 
 */
async function createSession(req, res) {
    try {
        //  Media Mode
        const mediaMode = req.body.mediaMode ? req.body.mediaMode : 'routed'
        //  If we are going to record or not
        const archive = req.body.archive ? req.body.archive : '0'
        //  Generate the session
        let session;
        if (archive == '1') {
            session = await vonage.video.createSession({ mediaMode, archiveMode: "always" });
        } else {
            session = await vonage.video.createSession({ mediaMode });
        }
        if (session && session.sessionId) {
            res.json({
                success: true,
                sessionId: session.sessionId,
                provider: config.VIDEO.provider,
                applicationId: config.VIDEO.vonage.APP_ID,
                openTokApiKey: config.VIDEO.opentok.API_KEY,
            });
        } else {
            return res.json({
                success: false,
                message: "Failed to create session",
            })
        }
    } catch (error) {
        console.error('Error making POST request:', error.message);
        return res.json({
            success: false,
            message: "Unknown error creating session",
        });
    }
}

/**
 * https://developer.vonage.com/en/tutorials/create-token/node/node
 */
function generateToken(req, res) {
    try {
        //  Role
        const role = req.body.role;
        if (!role) {
            return res.json({
                success: false,
                message: 'Roles: publisher, subscriber'
            });
        }
        //  Expiration time
        let expirationTimeInMinutes = req.body.expirationTimeInMinutes;
        if (!expirationTimeInMinutes) expirationTimeInMinutes = 60;
        //  Session ID
        const sessionId = req.body.sessionId;
        if (!sessionId) {
            return res.json({
                success: false,
                message: "Session ID is required",
            });
        }
        //  Username
        let userName = req.body.userName;
        if (!userName) {
            return res.json({
                success: false,
                message: "Username is required",
            });
        }
        // Generate a token
        const options = {
            role,
            expireTime: new Date().getTime() / 1000 + 7 * 24 * 60 * 60, // in one week
            data: 'username=' + userName,
            initialLayoutClassList: ["focus"]
        }
        const token = vonage.video.generateClientToken(sessionId, options);
        console.log("Generated Token: " + token);
        res.json({
            success: true,
            token,
        })
    } catch (ex) {
        console.log(ex.message)
        res.json({
            success: false,
            message: 'Unknown error'
        })
    }
}

/**
 * Returns this customer's recordings
 * https://github.com/Vonage/vonage-node-sdk/blob/c2f868ba9670c823990a87a485f10073ccfecc56/packages/video/lib/video.ts#L798
 */
async function getRecordings(req, res) {
    try {
        const recordingsRaw = await vonage.video.searchArchives();
        const recordings = recordingsRaw.items.map(({ url, ...rest }) => ({ ...rest }));
        return res.json({
            success: true,
            recordings
        })
    } catch(ex) {
        console.error('Error getting recordings:', ex.message);
        return res.json({
            success: false,
            message: "Unknown error",
        });
    }
}


/**
 * Starts a recording
 * https://github.com/Vonage/vonage-node-sdk/blob/c2f868ba9670c823990a87a485f10073ccfecc56/packages/video/lib/video.ts#L918
 */
async function startRecording(req, res) {
    try {
        //  Get input
        const sessionId = req.body.sessionId;
        const name = req.body.name;
        if (!sessionId || !name) {
            return res.json({
                success: false,
                message: 'Missing data'
            })
        }
        //  Start recording
        const recording = await vonage.video.startArchive(sessionId, {
            name
        });
        return res.json({
            success: true,
            recording
        })
    } catch(ex) {
        console.error('Error starting recording:', ex.message);
        return res.json({
            success: false,
            message: "Unknown error",
        });
    }
}


/**
 * Stops a recording
 * https://github.com/Vonage/vonage-node-sdk/blob/c2f868ba9670c823990a87a485f10073ccfecc56/packages/video/lib/video.ts#L918
 */
async function stopRecording(req, res) {
    try {
        //  Get input
        const archiveId = req.body.archiveId;
        if (!archiveId) {
            return res.json({
                success: false,
                message: 'Missing data'
            })
        }
        //  Stop recording
        await vonage.video.stopArchive(archiveId);
        return res.json({
            success: true,
        })
    } catch(ex) {
        console.error('Error stopping recording:', ex.message);
        return res.json({
            success: false,
            message: "Unknown error",
        });
    }
}



module.exports = {
    createSession,
    generateToken,
    getRecordings,
    startRecording,
    stopRecording,
}
