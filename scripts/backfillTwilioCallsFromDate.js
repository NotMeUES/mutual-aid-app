const csv = require("csv-parser");
const fs = require("fs");
const { join } = require("path");
const {
  createRequest,
  findRequestByPhone
} = require("~airtable/tables/requests");

let results = 0;

const numberMapping = {};

const sinceDate = new Date("18:40:00 UTC 2020-04-21");

(async () => {
  // calls.csv and recordings.csv can be downloaded from Twilio
  fs.createReadStream(join(__dirname, "./calls.csv"))
    .pipe(csv())
    .on("data", data => {
      if (new Date(data.StartTime).getTime() > sinceDate.getTime()) {
        numberMapping[data.Sid] = data.From;
      }
    })
    .on("end", () => {
      fs.createReadStream(join(__dirname, "./recordings.csv"))
        .pipe(
          csv({
            mapHeaders: ({ header }) => {
              if (header.includes("RSid")) {
                return "Sid";
              }
              return header;
            }
          })
        )
        .on("data", async data => {
          if (numberMapping[data.CallSid]) {
            const twilioSid = data.CallSid;
            const recordingUrl = `https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_ACCOUNT_ID}/Recordings/${data.Sid}`;
            const phone = numberMapping[data.CallSid];
            let status = "";

            results += 1;
            const [request, _err] = await findRequestByPhone(phone);
            if (request) {
              status = "Duplicate";
            }

            const newRequest = {
              message: recordingUrl,
              twilioSid,
              phone,
              status,
              source: "voice"
            };
            const [record, e] = await createRequest(newRequest);
            if (record) {
              console.log(`New record from twilio voice: ${record.getId()}`);
            }
            if (e) {
              console.log(`Error: ${e}`);
            }
          }
        })
        .on("end", () => {
          console.log(results);
        });
    });
})();
