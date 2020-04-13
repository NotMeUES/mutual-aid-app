const twilio = require("twilio");

module.exports = (req, res) => {
  const response = new twilio.twiml.VoiceResponse();
  response.play("https://bazaar-impala-3802.twil.io/assets/voicemail.mp3");

  response.record({
    action: "/twilio/call-handler-callback"
  });

  res.set("Content-Type", "text/xml");
  res.send(response.toString());
};
