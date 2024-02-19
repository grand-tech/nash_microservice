import dotenv from 'dotenv';
import AfricasTalking from "africastalking";

dotenv.config();

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            AT_API_KEY: string;
            AT_USERNAME: string;
            // will add more .evn variable here
        }
    }
}

const apiKey = process.env.AT_API_KEY;
const username = process.env.AT_USERNAME;


const africastalking = AfricasTalking({
    apiKey: apiKey,
    username: username,
});

export const SMS = async () => {
    //const token = africastalking.TOKEN;
    const sms = africastalking.SMS;
    try {
        const sendSmsResult = await africastalking.SMS.send({
            to: "to", // database query method to get user(s) numbers
            message: "message", // message to be sent from application controller
            from: "from", // applications short code
        });

    } catch (ex) {
        console.error(ex)
    }

    //const checkoutTokenResponse = await token.createCheckoutToken("phoneNumber");   

    //const res = await sms.createSubscription(options);
};