// Import required modules
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require('cors');
const config = require('./config')

//  WORKERS
const OpenTok = require('./work/func/opentok');
const VonageVideo = require('./work/func/vonage-video')

// Initialize Express app
const app = express();
app.use(bodyParser.json());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "public")));

// Enable CORS for http://localhost:4200
app.use(cors({
    origin: ['http://localhost:4200']
}))


// POST - Send SMS
app.post("/sms", (req, res) => {
    const SMS = require('./work/func/sms');
    SMS.sendMessage(req, res);
});

// POST endpoint to create a session
app.post("/create-session", (req, res) => {
    if (config.VIDEO.provider == 'vonage') {
        VonageVideo.createSession(req, res)
    } else {
        OpenTok.createSession(req, res)
    }
});

// POST endpoint to generate a token for a given session ID
app.post("/generate-token", (req, res) => {
    if (config.VIDEO.provider == 'vonage') {
        VonageVideo.generateToken(req, res)
    } else {
        OpenTok.generateToken(req, res)
    }
        
});

app.get("/join/:sessionId", (req, res) => {
    if (config.VIDEO.provider == 'vonage') {
        VonageVideo.generateToken(req, res)
    } else {
        OpenTok.joinSession(req, res)
    }
});

//  RECORDINGS

app.post('/recording/start', async (req, res) => {
    const VONAGE_VIDEO = require('./work/func/vonage-video');
    VONAGE_VIDEO.startRecording(req, res);
})

app.post('/recording/stop', async (req, res) => {
    const VONAGE_VIDEO = require('./work/func/vonage-video');
    VONAGE_VIDEO.stopRecording(req, res);
})

// GET - USER RECORDINGS
app.get("/recording/:page/:size", (req, res) => {
    const VONAGE_VIDEO = require('./work/func/vonage-video');
    VONAGE_VIDEO.getRecordings(req, res);
});



// GET endpoint to serve the index.html file
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
