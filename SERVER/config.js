module.exports = {

    SMS: {
        from: 'PHONE NUMBER HERE'
    },

    VIDEO: {
        provider: 'vonage',
        vonage: {
            APP_ID: 'YOUR VONAGE APP ID HERE',
            PRIVATE_KEY_PATH: __dirname + '/work/helper/private.key',
            API_KEY: 'YOUR API KEY HERE',
            API_SECRET: 'YOUR API SECRET HERE'
        },
        opentok: {
            API_KEY: "YOUR OPENTOK API KEY HERE",
            API_SECRET: "YOUR OPENTOK API SECRET HERE"
        }
    }

}