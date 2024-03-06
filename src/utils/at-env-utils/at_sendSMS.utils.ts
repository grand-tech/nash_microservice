import dotenv from 'dotenv';
import AfricasTalking from 'africastalking';

dotenv.config();

// Initialization of Africa's Talking
const africastalking = AfricasTalking({
  apiKey: process.env.AFRICAS_TALKING_API_KEY,
  username: process.env.AFRICAS_TALKING_USERNAME,
});

module.exports = async function sendSMS() {
  // Send promotional message
  try {
    const result = await africastalking.SMS.send({
      to: '+254796259104',
      message: 'Promotional USSD message',
      from: '85036',
    });
    console.log('Message sent successfully', result);
  } catch (ex) {
    console.error(ex);
  }
};
