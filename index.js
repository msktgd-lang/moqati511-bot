import express from "express";
import fetch from "node-fetch";

const app = express();

app.use(express.json());

//=====================
// الإعدادات
//=====================

const TOKEN = process.env.BOT_TOKEN;

const API = `https://api.telegram.org/bot${TOKEN}`;


//=====================
// الصفحة الرئيسية
//=====================

app.get("/", (req, res) => {
  res.send("MOQATI511 Bot is Running ✅");
});


//=====================
// استقبال Telegram
//=====================

app.post("/webhook", async (req, res) => {

  console.log(
    "Webhook received:",
    JSON.stringify(req.body)
  );


  try {

    const update = req.body;


    if (update.callback_query) {

  const chatId = update.callback_query.message.chat.id;

  const data = update.callback_query.data;


  if (data === "add_phone") {

    await sendMessage(
      chatId,
      "📱 أرسل رقم الجوال الآن."
    );

  }


  if (data === "add_wedding") {

    await sendMessage(
      chatId,
      "📅 أرسل بيانات موعد الزواج."
    );

  }


  return res.sendStatus(200);
}



if (!update.message) {
  return res.sendStatus(200);
}

    const chatId = update.message.chat.id;

    const text = update.message.text || "";


    //=====================
    // أمر البداية
    //=====================

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
                  callback_data: "add_phone"
                }
              ],

              [
                {
                  text: "📅 إضافة موعد الزواج",
                  callback_data: "add_wedding"
                }
              ],

              [
                {
                  text: "📋 جدول زواجات القبيلة",
                  url:
"https://script.google.com/macros/s/AKfycbwFdO1vFM08rqugX5FXi-Tyo69vgr2dbL7uS1XiqYg7IsWoBVjMEzA31WQ4q4LRlNXo1w/exec"
                }
              ],

              [
                {
                  text: "☎️ للتواصل معنا",
                  url:
"https://api.whatsapp.com/send/?phone=966500994990&text&type=phone_number&app_absent=0"
                }
              ]

            ]

          }

        })

      });


      return res.sendStatus(200);

    }



    //=====================
    // استقبال رقم الجوال
    //=====================

    if (text === "📱 إضافة رقم الجوال") {

      await sendMessage(
        chatId,
        "📱 أرسل رقم الجوال الآن."
      );

    }


    else {


      await sendMessage(
        chatId,
        "اختر خدمة من القائمة."
      );


    }


    res.sendStatus(200);



  }

  catch(error) {

    console.log(error);

    res.sendStatus(200);

  }


});



//=====================
// إرسال رسالة
//=====================

async function sendMessage(chatId, text) {


  const response = await fetch(
    API + "/sendMessage",
    {

      method: "POST",

      headers:{
        "Content-Type":"application/json"
      },


      body:JSON.stringify({

        chat_id:chatId,

        text:text

      })


    }
  );


  console.log(
    "Telegram:",
    await response.text()
  );


}



//=====================
// تشغيل السيرفر
//=====================

const PORT = process.env.PORT || 3000;


app.listen(PORT,()=>{

 console.log(
  `MOQATI511 Bot running on port ${PORT}`
 );

});
