import twilio from "twilio";

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export const sendSMS = async (to: string, message: string) => {
  try {
    const result = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: to, // must be in format +94xxxxxxxxx
    });
    console.log("SMS sent:", result.sid);
    return result;
  } catch (error) {
    console.error("SMS failed:", error);
    throw error;
  }
};