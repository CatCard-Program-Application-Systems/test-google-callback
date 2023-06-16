const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 3001;
const jsonParser = bodyParser.json();

app.get("/", (req, res) => res.type('html').send(html));

app.post("/", jsonParser, (req, res) => {
  console.log("Received a request!");
  console.log(req.body);
  console.log('signedMessage: ' + req.body.signedMessage);

  console.log('ip: ' + req.ip)

  const signedMessageObject = req.body.signedMessage;
  const message = JSON.parse(signedMessageObject);

  if (signedMessageObject.objectId) {
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

const server = app.listen(port, () => console.log(`Example app listening on port ${port}!`));

server.keepAliveTimeout = 120 * 1000;
server.headersTimeout = 120 * 1000;

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
