const config = require('../../config')
const { Vonage } = require('@vonage/server-sdk');
const { parsePhoneNumberFromString } = require('libphonenumber-js');

const vonage = new Vonage({
    applicationId: config.VIDEO.vonage.APP_ID,
    privateKey: config.VIDEO.vonage.PRIVATE_KEY_PATH,
    apiKey: config.VIDEO.vonage.API_KEY,
    apiSecret: config.VIDEO.vonage.API_SECRET,
});

async function sendMessage(req, res) {
    try {
        const from = config.SMS.from;
        const to = req.body.to;
        const message = req.body.message;
        //  Validate
        if (!from || !to || !message) {
            return res.status(200).json({
                success: false,
                message: 'Invalid data'
            })
        }
        //  TODO - FROM must be a user number
        //  TODO - TO must be a user number
        //  Format
        const phoneNumberObj = parsePhoneNumberFromString(to, 'GB');
        console.log(phoneNumberObj)
        if (!phoneNumberObj || !phoneNumberObj.isValid()) {
            return res.status(200).json({
                success: false,
                message: 'Invalid number'
            })
        }
        let toNumber = phoneNumberObj.format('E.164').substring(1, );
        toNumber = toNumber.substring(0, toNumber.length);
        console.log('Send to: ' + toNumber)
        //  Send the SMS
        const responseData = await vonage.sms.send({
            to: toNumber, 
            from, 
            text: message
        })
        if (responseData.messages[0]['status'] === '0') {
            console.log('Message sent successfully.');
            return res.status(200).json({
                success: true,
                message: responseData.messages[0]
            })
        } else {
            console.log(`Message failed with error: ${responseData.messages[0]['error-text']}`);
            return res.status(200).json({
                success: false,
                message: 'Error sending message'
            })
        }
    } catch (ex) {
        console.log('Error sending message: ')
        console.log(JSON.stringify(ex))
        return res.status(200).json({
            success: false,
            message: 'Unknown error'
        })
    }
}

module.exports = {
    sendMessage,
}