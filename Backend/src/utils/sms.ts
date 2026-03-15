import twilio from 'twilio';

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export const sendSMS = async (to: string, message: string) => {
  try {
    await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: to,  // must be in format +94771234567
    });
    console.log(`SMS sent to ${to}`);
  } catch (err) {
    console.error('Failed to send SMS:', err);
  }
};