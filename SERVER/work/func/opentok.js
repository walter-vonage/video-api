
const config = require("../../config");
const OpenTok = require("opentok");

// Your OpenTok API key and secret
const apiKey = config.VIDEO.opentok.API_KEY;
const apiSecret = config.VIDEO.opentok.API_SECRET;

// Initialize OpenTok
const opentok = new OpenTok(apiKey, apiSecret);

function createSession(req, res) {
    opentok.createSession({ 
        mediaMode: "routed", 
        archiveMode: "always"
    }, (error, session) => {
        if (error) {
            console.error("Error creating session:", error);
            return res.json({
                success: false,
                message: "Failed to create session",
            });
        }

        // Return the session ID in the response
        const sessionId = session.sessionId;
        console.log("Created Session ID: " + sessionId);
        res.json({
            success: true,
            provider: config.VIDEO.provider,
            sessionId,
        });
    })
}

function generateToken(req, res) {
    const sessionId = req.body.sessionId;
    let userName = req.body.userName;
    let expirationTimeInMinutes = req.body.expirationTimeInMinutes;

    if (!sessionId) {
        return res.json({
            success: false,
            message: "Session ID is required",
        });
    }

    if (!userName) {
        return res.json({
            success: false,
            message: "Username is required",
        });
    }

    if (!expirationTimeInMinutes) expirationTimeInMinutes = 60;

    // Generate a token
    const token = opentok.generateToken(sessionId, {
        role: "publisher", // 'subscriber' or 'moderator'
        expireTime: new Date().getTime() / 1000 + 60 * expirationTimeInMinutes,
        data: 'username=' + userName,
    });

    console.log("Generated Token: " + token);
    res.json({
        success: true,
        token,
    })
}

function joinSession(req, res) {
    const sessionId = req.params.sessionId;
    let userName = req.params.userName;
    let expirationTimeInMinutes = 60;

    if (!sessionId) {
        return res.json({
            success: false,
            message: "Session ID is required",
        });
    }

    if (!userName) {
        return res.json({
            success: false,
            message: "Channel Name is required",
        });
    }

    if (!expirationTimeInMinutes) expirationTimeInMinutes = 60;

    // Generate a token
    const token = opentok.generateToken(sessionId, {
        role: "publisher", // 'subscriber' or 'moderator'
        expireTime: new Date().getTime() / 1000 + 60 * expirationTimeInMinutes,
        data: '', // Optional Metadata 
    });

    console.log("Generated Token: " + token);
    res.json({
        success: true,
        token,
    })
}


/**
 * https://developer.vonage.com/en/video/server-sdks/node?source=video
 */
async function getRecordings(req, res) {
    try {
        const sessionId = req.params.sessionId;
        if (!sessionId) {
            return res.json({
                success: false,
                message: "Session ID is required",
            });
        }

        const offset = req.params.offset ? req.params.offset : 0;
        const count = req.params.count ? req.params.count : 5;

        const filter = {
            sessionId,
            offset,
            count
        }

        opentok.listArchives(filter, (error, archives, totalCount) => {
            console.log('Error', error)
            console.log('Successfully retrieved: ', totalCount);
            console.log('Recordings: ', archives);
            // for (let i = 0; i < recordings.length; i++) {
            //     console.log(recordings.items[i].id);
            // }
    
            res.json({
                success: true,
                recordings: archives,
            })
        })

    } catch (ex) {
        console.log(ex.message)
        res.json({
            success: false,
            message: 'Unknown error'
        })
    }
}

module.exports = {
    createSession,
    generateToken,
    joinSession,

    getRecordings,
}