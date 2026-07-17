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

  if (text === "/start") {

  await fetch(API + "/sendMessage", {

    method: "POST",

    headers: {
      "Content-Type": "application/json"
    },

    body: JSON.stringify({

      chat_id: chatId,

      text:
`🌹 أهلاً بك في بوت MOQATI511

اختر الخدمة المطلوبة:`,

      reply_markup: {

        inline_keyboard: [

          [
            {
              text: "📱 إضافة رقم الجوال",
              url: "https://script.google.com/macros/s/AKfycbwhcbIigHH5S9_gKfjBAvry92gyps3pR2ZIMKh9knLrAprWR9LG1djRZPZm0Eq-pftZnw/exec"
            }
          ],

          [
            {
              text: "📅 إضافة موعد الزواج",
              url: "https://script.google.com/macros/s/AKfycbw6yH_qWiFlZ9lCy5_bjw5CSPf8Cgz_c1aWxJ-s6x10yrDhwrTK7fUPRKYeE_h1oze-/exec"
            }
          ],

          [
            {
              text: "📋 جدول زواجات القبيلة",
              url: "https://script.google.com/macros/s/AKfycbwFdO1vFM08rqugX5FXi-Tyo69vgr2dbL7uS1XiqYg7IsWoBVjMEzA31WQ4q4LRlNXo1w/exec"
            }
          ],

          [
            {
              text: "☎️ للتواصل معنا",
              url: "https://api.whatsapp.com/send/?phone=966500994990&text&type=phone_number&app_absent=0"
            }
          ]

        ]

      }

    })

  });

  return res.sendStatus(200);
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
