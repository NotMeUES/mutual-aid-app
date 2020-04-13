const twilio = require("twilio");

module.exports = (req, res) => {
  console.log(req.body);
  const response = new twilio.twiml.VoiceResponse();
  response.play(
    {
      loop: 3
    },
    "https://bazaar-impala-3802.twil.io/assets/voicemail.mp3"
  );

  response.record({
    action: "/call-handler-callback"
  });

  res.set("Content-Type", "text/xml");
  res.send(response.toString());
};
