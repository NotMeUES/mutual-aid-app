const twilio = require("twilio");

module.exports = (req, res) => {
  const response = new twilio.twiml.VoiceResponse();
  response.say({ voice: "alice", language: "en-US" }, "Welcome!");

  const gather = response.gather({
    timeout: 20,
    action: "/twilio/call-handler",
    numDigits: 1
  });
  gather.say({ voice: "alice", language: "en-US" }, "For English, press 1.");
  gather.say(
    { voice: "alice", language: "es-MX" },
    "Para Español, oprima dos."
  );
  response.say({ voice: "alice", language: "en-US" }, "Welcome!");

  // Run if gather timeout
  response.redirect("/twilio/call-handler");

  res.set("Content-Type", "text/xml");
  res.send(response.toString());
};
