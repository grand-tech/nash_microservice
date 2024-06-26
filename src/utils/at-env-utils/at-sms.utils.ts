import dotenv from 'dotenv';
import AfricasTalking from 'africastalking';

dotenv.config();

// Initialization of Africa's Talking
const africastalking = AfricasTalking({
  apiKey: process.env.AFRICAS_TALKING_API_KEY,
  username: process.env.AFRICAS_TALKING_USERNAME,
});

/**
 * Bulk messaging.
 * @param to the recipients of the messages.
 * @param message the message to be sent.
 * @returns true if the message was sent successfully.
 */
export async function sendBulkSMS(to: string[], message: string) {
  // Send promotional message
  try {
    const result = await africastalking.SMS.send({
      // list to be sourced from database
      to: to,
      message: message,
      from: '85036',
    });

    console.log('Message sent successfully', result);
    return true;
  } catch (ex) {
    console.error(ex);
    return false;
  }
}

/**
 * Sends single recipient SMSs
 * @param to the recipient of the sms.
 * @param message the message body.
 */
export async function sendSMS(to: string, message: string) {
  // Send promotional message
  try {
    const result = await africastalking.SMS.send({
      to: to,
      message: message,
      from: '85036',
    });
    console.log('Message sent successfully', result);
  } catch (ex) {
    console.error(ex);
  }
}
