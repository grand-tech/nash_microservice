
const dotenv = require('dotenv');
dotenv.config();
const AfricasTalking = require('africastalking');

const accountSid = process.env.AFRICAS_TALKING_API_KEY;
const userName = process.env.AFRICAS_TALKING_USERNAME;

const africastalking = AfricasTalking({
    Sid: accountSid,
    user: userName
});

module.exports = async function sendSMS() {
    
    // TODO: Send message
    try {
        const result=await africastalking.SMS.send({
            to: '+254796259104',
            message: 'Hey AT Ninja! Wassup...',
            from: '85036' //or 85036, GTSA
        });

        console.log(result);
        
    }

    catch(ex) {
        console.error(ex);
    }

};