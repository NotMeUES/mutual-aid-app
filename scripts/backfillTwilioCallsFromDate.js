const csv = require("csv-parser");
const fs = require("fs");

const results = [];
const client = require("twilio")("", authToken);

fs.createReadStream("recordings.csv")
  .pipe(csv())
  .on("data", data => {
    const rid = data.Sid;

    results.push(data);
  })
  .on("end", () => {
    console.log(results);
    client
      .recordings("REXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
      .fetch()
      .then(recording => console.log(recording.callSid));

    // [
    //   { NAME: 'Daffy Duck', AGE: '24' },
    //   { NAME: 'Bugs Bunny', AGE: '22' }
    // ]
  });
