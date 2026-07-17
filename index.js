import express from "express";
import fetch from "node-fetch";

const app = express();

app.use(express.json());


//=====================
// الإعدادات
//=====================

const TOKEN = process.env.BOT_TOKEN;

const API = `https://api.telegram.org/bot${TOKEN}`;


// سكربت إضافة رقم الجوال
const PHONE_SCRIPT_URL =
"https://script.google.com/macros/s/AKfycbzEqJ1-idCkcAyIDaxHGCv_PZuyVXMAHQny28Rb0ZrcJvab4roBrVLyI6g9cWWgV9WP/exec";


// سكربت إضافة الزواج (الجديد)
const WEDDING_SCRIPT_URL =
"https://script.google.com/macros/s/AKfycbyB7ewIF7Mb81O3j8FTep26yBS9U2bhzmCV1JgR3OAAIjGhDR6cxz7OFUrbKvZu935Z/exec";


// جدول الزواجات
const WEDDING_TABLE_URL =
"https://script.google.com/macros/s/AKfycbwFdO1vFM08rqugX5FXi-Tyo69vgr2dbL7uS1XiqYg7IsWoBVjMEzA31WQ4q4LRlNXo1w/exec";


// الواتساب
const WHATSAPP_URL =
"https://api.whatsapp.com/send/?phone=966500994990&text&type=phone_number&app_absent=0";



//=====================
// قوائم الاختيار
//=====================

const FIFTHS = [

"ذوي عامر",
"ذوي صويّب",
"ذوي جعرور",
"ذوي حميّد",
"الجعيدات",
"ذوي عبّاد",
"ذوي هادي",
"ذوي قميمة",
"ذوي هندي"

];


const INVITATIONS = [

"عامة",
"خاصة"

];



// حالات المستخدم
const users = {};



//=====================
// تشغيل الصفحة
//=====================

app.get("/",(req,res)=>{

res.send(
"MOQATI511 Bot is Running ✅"
);

});



//=====================
// استقبال Telegram
//=====================

app.post("/webhook",async(req,res)=>{


console.log(
"Webhook:",
JSON.stringify(req.body)
);


try{


const update=req.body;



if(update.callback_query){


const chatId =
update.callback_query.message.chat.id;


const data =
update.callback_query.data;


// هنا ستضاف معالجة الأزرار في الجزء الثاني


return res.sendStatus(200);

}



if(!update.message){

return res.sendStatus(200);

}



const chatId =
update.message.chat.id;


const text =
update.message.text || "";



// هنا ستضاف خطوات النماذج في الجزء الثاني



res.sendStatus(200);



}catch(error){


console.log(error);

res.sendStatus(200);


}

 //=====================
// معالجة الرسائل والأزرار
//=====================


if(update.callback_query){

const chatId =
update.callback_query.message.chat.id;

const data =
update.callback_query.data;


// زر إضافة رقم الجوال

if(data==="add_phone"){

users[chatId]={
type:"phone",
step:"name"
};


await sendMessage(
chatId,
"👤 أرسل الاسم الثلاثي:"
);


return res.sendStatus(200);

}



// زر إضافة موعد الزواج

if(data==="add_wedding"){

users[chatId]={
type:"wedding",
step:"groom"
};


await sendMessage(
chatId,
"👤 أرسل اسم العريس:"
);


return res.sendStatus(200);

}



// اختيار الخامس

if(data.startsWith("fifth_")){


const fifth =
data.replace("fifth_","");


if(users[chatId]){


users[chatId].fifth=fifth;



if(users[chatId].type==="phone"){

users[chatId].step="phone";


await sendMessage(
chatId,
"📱 أرسل رقم الجوال (10 أرقام بدون مسافات):"
);


}



if(users[chatId].type==="wedding"){

users[chatId].step="phone";


await sendMessage(
chatId,
"📱 أرسل رقم الجوال (10 أرقام بدون مسافات):"
);


}



}


return res.sendStatus(200);

}



// اختيار نوع الدعوة

if(data.startsWith("invite_")){


const invitation =
data.replace("invite_","");


users[chatId].invitation=invitation;


await saveWedding(
users[chatId]
);



await sendMessage(
chatId,
"✅ تم حفظ موعد الزواج بنجاح."
);


delete users[chatId];


return res.sendStatus(200);

}



}



//=====================
// الرسائل العادية
//=====================


if(update.message){


const chatId =
update.message.chat.id;


const text =
update.message.text || "";



// البداية

if(text==="/start"){


await sendStart(chatId);


return res.sendStatus(200);

}



// إذا كان له نموذج مفتوح

if(users[chatId]){


const state=users[chatId];



// إضافة رقم الجوال

if(state.type==="phone"){


await handlePhone(
chatId,
text
);


return res.sendStatus(200);

}



// إضافة الزواج

if(state.type==="wedding"){


await handleWedding(
chatId,
text
);


return res.sendStatus(200);

}


}




await sendMessage(
chatId,
"اختر خدمة من القائمة."
);


return res.sendStatus(200);


}

 //=====================
// القائمة الرئيسية
//=====================

async function sendStart(chatId){


await fetch(
API+"/sendMessage",
{

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
url:WEDDING_TABLE_URL
}
],


[
{
text:"☎️ للتواصل معنا",
url:WHATSAPP_URL
}
]


]


}


})


});


}



//=====================
// نموذج رقم الجوال
//=====================


async function handlePhone(chatId,text){


const state=users[chatId];



if(state.step==="name"){


state.name=text;

state.step="choose_fifth";


await sendFifths(chatId);


return;

}



if(state.step==="phone"){



if(!/^\d{10}$/.test(text)){


await sendMessage(
chatId,
"⚠️ رقم الجوال يجب أن يكون 10 أرقام بدون مسافات."
);


return;

}



state.phone=text;


const result =
await savePhone(state);



if(result==="exists"){


await sendMessage(
chatId,
"⚠️ هذا الرقم تمت إضافته مسبقاً."
);


delete users[chatId];


return;

}



await sendMessage(
chatId,
"✅ تم حفظ رقم الجوال بنجاح."
);


delete users[chatId];


}



}



//=====================
// نموذج الزواج
//=====================


async function handleWedding(chatId,text){


const state=users[chatId];



if(state.step==="groom"){


state.groom=text;

state.step="choose_fifth";


await sendFifths(chatId);


return;

}



if(state.step==="phone"){



if(!/^\d{10}$/.test(text)){


await sendMessage(
chatId,
"⚠️ رقم الجوال يجب أن يكون 10 أرقام بدون مسافات."
);


return;

}


state.phone=text;

state.day=getToday();


state.step="hall";


await sendMessage(
chatId,
`📅 تاريخ اليوم:

${state.day}

🏛 أرسل اسم القاعة:`
);


return;


}



if(state.step==="hall"){


state.hall=text;

state.step="choose_invite";


await sendInvitations(chatId);


return;


}



}

 
//=====================
// قائمة الخوامس
//=====================

async function sendFifths(chatId){


let buttons=[];


for(let i=0;i<FIFTHS.length;i+=2){


buttons.push(

FIFTHS.slice(i,i+2).map(name=>({

text:name,

callback_data:"fifth_"+name

}))

);


}



await fetch(
API+"/sendMessage",
{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

chat_id:chatId,

text:"👥 اختر الخامس:",


reply_markup:{

inline_keyboard:buttons

}

})


});


}



//=====================
// قائمة الدعوة
//=====================

async function sendInvitations(chatId){


await fetch(
API+"/sendMessage",
{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

chat_id:chatId,

text:"🎟 اختر نوع الدعوة:",


reply_markup:{

inline_keyboard:[

[
{
text:"🎟 عامة",
callback_data:"invite_عامة"
}
],

[
{
text:"🎟 خاصة",
callback_data:"invite_خاصة"
}
]

]

}


})


});


}



//=====================
// حفظ رقم الجوال
//=====================

async function savePhone(data){


const response =
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


const result =
await response.text();


console.log(
"PHONE RESPONSE:",
result
);


if(result.includes("exists")){

return "exists";

}


return "success";


}



//=====================
// حفظ الزواج
//=====================

async function saveWedding(data){


const response =
await fetch(
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

date:data.day,

hall:data.hall,

invitation:data.invitation

})

});


console.log(
"WEDDING RESPONSE:",
await response.text()
);


}



//=====================
// التاريخ
//=====================

function getToday(){


const now=new Date();


return now.toLocaleDateString(
"ar-SA-u-ca-islamic",
{
timeZone:"Asia/Riyadh"
}
)
+
"\n"+
now.toLocaleDateString(
"en-CA",
{
timeZone:"Asia/Riyadh"
}
);


}



//=====================
// إرسال رسالة
//=====================

async function sendMessage(chatId,text){


const response =
await fetch(
API+"/sendMessage",
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

});
