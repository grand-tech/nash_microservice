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
    const options = await africastalking.SMS.send({
      // list to be sourced from database
      to: ['+254796566475', '+254733XYZABC'],
      message: 'Promotional USSD message',
      from: '85036',
    });

    console.log('Message sent successfully', options);
  } catch (ex) {
    console.error(ex);
  }
};
