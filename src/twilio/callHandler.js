const twilio = require("twilio");

module.exports = (req, res) => {
  const twilReq = req.body;
  const response = new twilio.twiml.VoiceResponse();

  switch (twilReq.Digits) {
    case "2":
      response.play(
        "https://bazaar-impala-3802.twil.io/assets/voicemail-spanish.mp3"
      );
      break;
    default:
      // to English
      response.play("https://bazaar-impala-3802.twil.io/assets/voicemail.mp3");
      break;
  }

  response.pause();
  response.record({
    action: "/twilio/call-handler-callback"
  });

  res.set("Content-Type", "text/xml");
  res.send(response.toString());
};
