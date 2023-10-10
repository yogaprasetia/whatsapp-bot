const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");

const client = new Client({
  authStrategy: new LocalAuth(),
});

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("Client is ready!");
});

client.initialize();

const api = async (req, res) => {
  let nohp = req.query.nohp;
  const pesan = req.query.pesan;

  try {
    if (nohp.startsWith("0")) {
      nohp = "62" + nohp.slice(1) + "@c.us";
    } else if (nohp.startsWith("62")) {
      nohp = nohp + "@c.us";
    } else {
      nohp = "62" + nohp + "@c.us";
    }
    const user = await client.isRegisteredUser(nohp);
    if (user) {
      client.sendMessage(nohp, pesan);
      res.json({ status: "berhasil terkirim", pesan });
    } else {
      res.json({ status: "maaf error" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "error",
      pesan: "pesan error",
    });
  }
};

module.exports = api;
