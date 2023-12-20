import { emailSender } from './middlewares/services/Email/mail.js';
import app from './src/app.js';
import { config } from 'dotenv';
config({ path: '.env' });
import *as cron from 'node-cron';
import { findSessionForReminders } from './src/modules/Session/sessionController.js';
import { getUsersForReminder } from './src/modules/User/userController.js';

// Port Number
const port = process.env.PORT || 8080;

process.on('uncaughtException', err => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

// Reminder Email
const scheduledEmails =(when,flag)=>{
  cron.schedule(when, async()=> {
    let dateNow = new Date;
    let currentDayOfMonth = dateNow.getDate();
    let currentMonth = dateNow.getMonth(); // Be careful! January is 0, not 1
    let currentYear = dateNow.getFullYear();
    let currentHour = dateNow.getHours();
    let currentMinutes = dateNow.getMinutes();
    let sessions = await findSessionForReminders()
    for (const ele of sessions) {
      let sessionDate = ele.date
      if(sessionDate.getFullYear()== currentYear && sessionDate.getMonth() == currentMonth) {
        //reminder 1 day left
        if(flag){
          console.log('reminder 1 day left');
          if(sessionDate.getDate() == currentDayOfMonth+1) {
            const users = await getUsersForReminder(ele.instructorHandler,ele.clientHandler)
            users.forEach(user=>{
              let email = user.email
              let Name = user.firstName
              // let sessionLink = ''
              let subject = 'reminder';
              let content = 'tomorrow'
              emailSender(subject,email,Name,ele,content)
              flag = false;
            })
          }          
        }
        //reminder 15 minutes left
        else if(sessionDate.getDate() == currentDayOfMonth){
          if(sessionDate.getHours()==currentHour+2){  //+2 for egypt (GMT)
            console.log('reminder 15 minutes left ========> not sent yet');
            if(sessionDate.getMinutes()> currentMinutes && sessionDate.getMinutes() == currentMinutes+15){
              // if(sessionDate.getMinutes()> currentMinutes){
              const users = await getUsersForReminder(ele.instructorHandler,ele.clientHandler)
              users.forEach(user=>{
                let email = user.email
                let Name = user.firstName
                // let sessionLink = ''
                let subject = 'reminder'
                let content = 'after 15 minutes'
                emailSender(subject,email,Name,ele,content)
                console.log('reminder 15 minutes left ========> sent successfully');
              })
            }          
          }
        }
      }
    };
  },{
    scheduled: false,
    timezone: "Egypt"
  });
}
scheduledEmails("1 * * * * *",false) // the first sec of each minute
scheduledEmails("0 1 0 * * *",true) // 12 : 01 : 00 AM

// Starting Server
app.listen(port, () => {
  console.log(`Server is running on port ${port}...`);
});