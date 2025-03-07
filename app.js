const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 3001;
const jsonParser = bodyParser.json();
const http = require('http');

app.get("/", (req, res) => res.type('html').send(html));

app.post("/", jsonParser, (req, res) => {
  console.log("Received a request!");
  console.log(req.body);
  console.log(req.get('user-agent'));


  var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
  console.log('ip address: ' + ip)

  const ipAddress = req.socket.remoteAddress;
  console.log('ipAddress: socket ' + ipAddress);

  const signedMessageObject = req.body.signedMessage;
  const message = JSON.parse(signedMessageObject);

  if (message.objectId) {
    const [issuerId, objectId] = message.objectId.split('.');
    const eventType = message.eventType;

    if (!issuerId || !objectId) {
      // invalid payload, request discarded
      res.status(400).send({ message: 'invalid payload, request discarded' });
    } else {
      // if (eventType !== 'del' && eventType !== 'save')
      //     return res.status(200).send({ message: `request accepted, but no action taken. event type "${eventType}" is not supported` });

      // objectId: gw-dcid-<ucmnetid>
      const ucmnetid = objectId.split('gw-dcid-')[1];

      console.log('ucmnetid: ' + ucmnetid);
      console.log('eventType: ' + eventType);
    }
  }

  res.json(req.body);
});


// apple request validation middleware
function validateAppleRequest(req, res, next) {

  if (!req.headers.authorization) {
    return res.status(401).json({ error: 'No credentials sent!' });
  }
  // format: ApplePass <authenticationToken>
  else if (req.headers.authorization.indexOf('ApplePass ') !== 0 ||
    req.headers.authorization.split(' ').length !== 2 ||
    req.headers.authorization.split(' ')[1] !== 'gCh1J7iEc4Rzaq1yMNiDsGJvY9V4EYn') {
    return res.status(401).json({ error: 'Invalid credentials sent!' });
  }

  const { passIdentifier } = req.params;

  if (passIdentifier !== "pass.edu.ucmerced.dcid") {
    return res.status(400).send("Invalid passIdentifier");
  }

  next();
}


app.post("/v1/devices/:deviceId/registrations/:passIdentifier/:serialNumber", validateAppleRequest,
  async (req, res) => {
    try {
      const { deviceId, serialNumber } = req.params;
      const { pushToken } = req.body;

      console.log('deviceId: ' + deviceId)
      console.log('serialNumber: ' + serialNumber)
      console.log('pushToken: ' + pushToken)

      console.log(req.headers.authorization)

      console.log(req.body)

      console.log('ip: ' + req.ip)

      var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
      console.log('ip address: ' + ip)

      // serialNumber: dcid-<ucmnetid>
      const ucmnetid = serialNumber.split('dcid-')[1];

      console.log('ucmnetid: ' + ucmnetid);

      res.status(201).send("Registered");
    }
    catch (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
    }
  }
);

// const server = app.listen(port, () => console.log(`Example app listening on port ${port}!`));

// server.keepAliveTimeout = 120 * 1000;
// server.headersTimeout = 120 * 1000;

http.createServer(app).listen(port, () => console.log(`Example app listening on port ${port}!`));


const html = `
<!DOCTYPE html>
<html>
  <head>
    <title>Hello from Render!</title>
    <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.5.1/dist/confetti.browser.min.js"></script>
    <script>
      setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          disableForReducedMotion: true
        });
      }, 500);
    </script>
    <style>
      @import url("https://p.typekit.net/p.css?s=1&k=vnd5zic&ht=tk&f=39475.39476.39477.39478.39479.39480.39481.39482&a=18673890&app=typekit&e=css");
      @font-face {
        font-family: "neo-sans";
        src: url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("woff2"), url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/d?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("woff"), url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/a?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("opentype");
        font-style: normal;
        font-weight: 700;
      }
      html {
        font-family: neo-sans;
        font-weight: 700;
        font-size: calc(62rem / 16);
      }
      body {
        background: white;
      }
      section {
        border-radius: 1em;
        padding: 1em;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-right: -50%;
        transform: translate(-50%, -50%);
      }
    </style>
  </head>
  <body>
    <section>
      Hello from Render!
      Test Google Wallet API callback
    </section>
  </body>
</html>
`
