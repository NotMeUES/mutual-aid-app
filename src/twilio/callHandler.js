const twilio = require("twilio");
const { fields: requestFields } = require("~airtable/tables/requests");

module.exports = (req, res) => {
  const twilReq = req.body;
  const response = new twilio.twiml.VoiceResponse();
  let language = requestFields.languages_options.english;

  switch (twilReq.Digits) {
    case "2":
      language = requestFields.languages_options.spanish;
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
    action: `/twilio/call-handler-callback?language=${language}`
  });

  res.set("Content-Type", "text/xml");
  res.send(response.toString());
};
