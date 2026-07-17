import express from "express";
import fetch from "node-fetch";

const app = express();

app.use(express.json());

const TOKEN = process.env.BOT_TOKEN;
const API = `https://api.telegram.org/bot${TOKEN}`;

app.get("/", (req, res) => {
  res.send("MOQATI511 Bot is Running ✅");
});

app.post("/webhook", async (req, res) => {

  console.log("Webhook received:", JSON.stringify(req.body));

  try {
  
    const update = req.body;

    if (!update.message) {
      return res.sendStatus(200);
    }

    const chatId = update.message.chat.id;
    const text = update.message.text || "";

    let reply = "لم أفهم طلبك.";

    if (text === "/start") {
      reply = "🌹 أهلاً بك في بوت MOQATI511";
    }

   const telegramResponse = await fetch(API + "/sendMessage", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    chat_id: chatId,
    text: reply
  })
});

console.log(
  "Telegram response:",
  await telegramResponse.text()
);

    res.sendStatus(200);

  } catch (error) {

    console.log(error);
    res.sendStatus(200);

  }

});


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("MOQATI511 Bot running on port " + PORT);
});
