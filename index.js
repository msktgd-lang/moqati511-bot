import express from "express";
import fetch from "node-fetch";

const app = express();

app.use(express.json());


//=====================
// الإعدادات
//=====================

const TOKEN = process.env.BOT_TOKEN;

const API = `https://api.telegram.org/bot${TOKEN}`;


// حفظ أرقام الجوال
const PHONE_SCRIPT_URL =
"https://script.google.com/macros/s/AKfycbzEqJ1-idCkcAyIDaxHGCv_PZuyVXMAHQny28Rb0ZrcJvab4roBrVLyI6g9cWWgV9WP/exec";


// حفظ الزواج
const WEDDING_SCRIPT_URL =
"https://script.google.com/macros/s/AKfycbyB7ewIF7Mb81O3j8FTep26yBS9U2bhzmCV1JgR3OAAIjGhDR6cxz7OFUrbKvZu935Z/exec";

// حالات المستخدمين
const userStates = {};


//=====================
// الصفحة الرئيسية
//=====================

app.get("/", (req,res)=>{

 res.send("MOQATI511 Bot is Running ✅");

});


//=====================
// Webhook Telegram
//=====================

app.post("/webhook", async(req,res)=>{


console.log(
"Webhook received:",
JSON.stringify(req.body)
);


try{


const update=req.body;



//=====================
// ضغط الأزرار
//=====================


if(update.callback_query){


const chatId =
update.callback_query.message.chat.id;


const data =
update.callback_query.data;



// إضافة رقم الجوال

if(data==="add_phone"){


 userStates[chatId]={
  type:"phone",
  step:"name"
 };


 await sendMessage(
  chatId,
  "👤 أرسل الاسم الثلاثي:"
 );


}



// إضافة موعد الزواج

if(data==="add_wedding"){


 userStates[chatId]={
  type:"wedding",
  step:"groom"
 };


 await sendMessage(
  chatId,
  "👤 أرسل اسم العريس:"
 );


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



// متابعة النماذج

if(userStates[chatId]){


 if(userStates[chatId].type==="phone"){

  await handlePhone(
   chatId,
   text
  );

 }


 if(userStates[chatId].type==="wedding"){

  await handleWedding(
   chatId,
   text
  );

 }


 return res.sendStatus(200);

}

 //=====================
// أمر البداية
//=====================

if(text === "/start"){


await fetch(API + "/sendMessage",{

method:"POST",

headers:{
"Content-Type":"application/json"
},


body:JSON.stringify({

chat_id:chatId,

text:
`🌹 أهلاً بك في بوت MOQATI511

اختر الخدمة المطلوبة:`,


reply_markup:{

inline_keyboard:[


[
{
text:"📱 إضافة رقم الجوال",
callback_data:"add_phone"
}
],


[
{
text:"📅 إضافة موعد الزواج",
callback_data:"add_wedding"
}
],


[
{
text:"📋 جدول زواجات القبيلة",
url:
"https://script.google.com/macros/s/AKfycbwFdO1vFM08rqugX5FXi-Tyo69vgr2dbL7uS1XiqYg7IsWoBVjMEzA31WQ4q4LRlNXo1w/exec"
}
],


[
{
text:"☎️ للتواصل معنا",
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

async function handlePhone(chatId,text){


const state=userStates[chatId];



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
"✅ تم حفظ رقم الجوال بنجاح."
);


delete userStates[chatId];


}


}

//=====================
// نموذج موعد الزواج
//=====================

async function handleWedding(chatId,text){


const state = userStates[chatId];



if(state.step==="groom"){


state.groom=text;

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

state.step="day";


await sendMessage(
chatId,
"📅 أرسل اليوم:"
);


return;

}



if(state.step==="day"){


state.day=text;

state.step="date";


await sendMessage(
chatId,
"🗓 أرسل التاريخ الهجري:"
);


return;

}



if(state.step==="date"){


state.date=text;

state.step="hall";


await sendMessage(
chatId,
"🏛 أرسل اسم القاعة:"
);


return;

}



if(state.step==="hall"){


state.hall=text;

state.step="invitation";


await sendMessage(
chatId,
"🎟 أرسل نوع الدعوة:"
);


return;

}



if(state.step==="invitation"){


state.invitation=text;


await saveWedding(state);


await sendMessage(
chatId,
"✅ تم حفظ موعد الزواج بنجاح."
);


delete userStates[chatId];


}


}



//=====================
// الحفظ في Google Sheet
//=====================

async function savePhone(data){


await fetch(
PHONE_SCRIPT_URL,
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

});


}



async function saveWedding(data){

 const response = await fetch(
 WEDDING_SCRIPT_URL,
 {
 method:"POST",
 headers:{
 "Content-Type":"application/json"
 },
 body:JSON.stringify({

 type:"wedding",
 groom:data.groom,
 fifth:data.fifth,
 phone:data.phone,
 day:data.day,
 date:data.date,
 hall:data.hall,
 invitation:data.invitation

 })
 });


 console.log(
 "Wedding Google:",
 await response.text()
 );

}

}



//=====================
// إرسال رسالة
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

});


console.log(
"Telegram:",
await response.text()
);


}



//=====================
// تشغيل السيرفر
//=====================

const PORT =
process.env.PORT || 3000;


app.listen(PORT,()=>{


console.log(
`MOQATI511 Bot running on port ${PORT}`
);


});

 
