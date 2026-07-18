console.log("NEW VERSION GEMINI BOT");
console.log("RUNNING NEW GEMINI VERSION");
import express from "express";
import fetch from "node-fetch";
import knowledge from "./knowledge.json" with { type: "json" };
console.log("===== GEMINI CODE LOADED =====");

console.log("GEMINI VERSION RUNNING");
const app = express();

app.use(express.json());


//=====================
// الإعدادات
//=====================

const TOKEN = process.env.BOT_TOKEN;

const API = `https://api.telegram.org/bot${TOKEN}`;

import { GoogleGenerativeAI } from "@google/generative-ai";


const genAI = new GoogleGenerativeAI(
 process.env.GEMINI_API_KEY
);


const model = genAI.getGenerativeModel({
 model: "gemini-1.5-flash"
});

// رابط Google Apps Script

const GOOGLE_SCRIPT_URL =
"https://script.google.com/macros/s/AKfycbzEqJ1-idCkcAyIDaxHGCv_PZuyVXMAHQny28Rb0ZrcJvab4roBrVLyI6g9cWWgV9WP/exec";



// حالات المستخدمين

const userStates = {};

const assistantUsers = {};



// ذاكرة بسيطة للمحادثة

const chatMemory = {};



//=====================
// الصفحة الرئيسية
//=====================

app.get("/", (req,res)=>{

 res.send("MOQATI511 Bot is Running ✅");

});


//=====================
// الذكاء الاصطناعي
//=====================

async function askAI(question, chatId) {

  // البحث في المعرفة الخاصة أولاً
  for (const key in knowledge) {
    if (question.includes(key)) {
      return knowledge[key];
    }
  }

  // إنشاء ذاكرة للمحادثة
  if (!chatMemory[chatId]) {
    chatMemory[chatId] = [];
  }

  // حفظ رسالة المستخدم
  chatMemory[chatId].push({
    role: "user",
    content: question
  });

  // الاحتفاظ بآخر 10 رسائل فقط
  if (chatMemory[chatId].length > 10) {
    chatMemory[chatId] = chatMemory[chatId].slice(-10);
  }

  // تحويل المحادثة إلى نص
  const history = chatMemory[chatId]
    .map(msg => `${msg.role === "user" ? "المستخدم" : "المساعد"}: ${msg.content}`)
    .join("\n");

  // سؤال Gemini
  const result = await model.generateContent(`
أنت مساعد ذكي لبوت MOQATI511.

تحدث باللغة العربية بأسلوب طبيعي ومحترم.

إذا كان السؤال يتعلق بخدمات القبيلة فاستخدم المعلومات الموجودة في المعرفة فقط.
أما إذا كان سؤالاً عاماً فأجب عنه بشكل طبيعي.

المحادثة السابقة:
${history}

سؤال المستخدم:
${question}
`);

  const answer = result.response.text();

  // حفظ رد المساعد
  chatMemory[chatId].push({
    role: "assistant",
    content: answer
  });

  return answer;
}

//=====================
// استقبال Telegram
//=====================

app.post("/webhook", async(req,res)=>{


 console.log(
  "Webhook received:",
  JSON.stringify(req.body)
 );


 try{


 const update=req.body;



 if(update.callback_query){


  const chatId =
  update.callback_query.message.chat.id;


  const data =
  update.callback_query.data;



  // المساعد الذكي

  if(data==="assistant"){


    assistantUsers[chatId]=true;


    await sendMessage(

      chatId,

`🤖 أهلاً بك في المساعد الذكي

اكتب سؤالك وسأحاول مساعدتك.

للخروج اكتب:
إلغاء`

    );


    return res.sendStatus(200);

  }


//=====================
// إضافة رقم الجوال
//=====================

if(data==="add_phone"){

 userStates[chatId]={
  step:"name"
 };


 await sendMessage(
  chatId,
  "👤 أرسل الاسم الثلاثي:"
 );


 return res.sendStatus(200);

}


//=====================
// إضافة الزواج
//=====================

if(data==="add_wedding"){


 await sendMessage(
  chatId,
  "📅 سيتم تجهيز إضافة موعد الزواج."
 );


 return res.sendStatus(200);

}


return res.sendStatus(200);


 }


 if(!update.message){

  return res.sendStatus(200);

 }


 const chatId =
 update.message.chat.id;


 const text =
 update.message.text || "";



 //=====================
 // المساعد الذكي
 //=====================

 if(assistantUsers[chatId]){


  if(text==="إلغاء"){


    delete assistantUsers[chatId];


    await sendMessage(

      chatId,

      "✅ تم إغلاق المساعد الذكي."

    );


    return res.sendStatus(200);

  }



 let reply;

try {

  reply = await askAI(text, chatId);

}
catch(error){

  console.log("GEMINI ERROR:", error);

  reply = "حدث خطأ أثناء الاتصال بالمساعد الذكي.";

}


await sendMessage(
 chatId,
 reply
);

  return res.sendStatus(200);


 }



// متابعة التسجيل

if(userStates[chatId]){


 await handlePhoneForm(
  chatId,
  text
 );


 return res.sendStatus(200);

}



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
              text: "🤖 المساعد الذكي",
              callback_data: "assistant"
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
   //=====================
// نهاية استقبال الرسائل
//=====================

await sendMessage(
 chatId,
 "اختر خدمة من القائمة."
);


res.sendStatus(200);


}

catch(error){

 console.log(error);

 res.sendStatus(200);

}


});
//=====================
// نموذج رقم الجوال
//=====================

async function handlePhoneForm(chatId,text){


 const state = userStates[chatId];


 if(state.step==="name"){


  state.name=text;

  state.step="fifth";


  await sendMessage(
   chatId,
   "👥 أرسل اسم الخامس:"
  );


  return;

 }




 if(state.step==="fifth"){


  state.fifth=text;

  state.step="phone";


  await sendMessage(
   chatId,
   "📱 أرسل رقم الجوال:"
  );


  return;

 }




 if(state.step==="phone"){


  state.phone=text;



  await savePhone(state);



  await sendMessage(
   chatId,
   "✅ تم حفظ بيانات رقم الجوال بنجاح."
  );


  delete userStates[chatId];


 }


}




//=====================
// حفظ رقم الجوال في Google Sheet
//=====================

async function savePhone(data){


 const response = await fetch(
  GOOGLE_SCRIPT_URL,
  {

   method:"POST",

   headers:{
    "Content-Type":"application/json"
   },


   body:JSON.stringify({

    type:"phone",

    name:data.name,

    fifth:data.fifth,

    phone:data.phone

   })

  }
 );


 console.log(
  "Google Sheet:",
  await response.text()
 );


}




//=====================
// إرسال رسالة Telegram
//=====================

async function sendMessage(chatId,text){


 const response = await fetch(
  API + "/sendMessage",
  {


   method:"POST",


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
