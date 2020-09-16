const fetch = require('isomorphic-fetch');
const join = require('lodash/join');
const map = require('lodash/map');
const admin = require('firebase-admin');
const { utcToZonedTime, format } = require('date-fns-tz');
const startOfHour = require('date-fns/startOfHour');
const formatISO = require('date-fns/formatISO');
const differenceInHours = require('date-fns/differenceInHours')

const {
  APPLICATION_ID,
  API_KEY,
  KNACK_API_URL,
  KNACK_BIN_DAYS_OBJECT_ID,
  KNACK_USER_CONFIGS_OBJECT_ID,
  KNACK_NEWSFEED_OBJECT_ID,
  FIREBASE_ADMIN,
  AWS_MYSQL_URL,
  AWS_MYSQL_USER,
  AWS_MYSQL_PASS
} = process.env;


// const fields = {
//   deleted : 'field_2705',
//   status : 'field_2701',
//   sent : 'field_2713',
//   live : 'field_2700',
//   time : 'field_2699'
// }

const config = {
  host     : AWS_MYSQL_URL,
  user     : AWS_MYSQL_USER,
  password : AWS_MYSQL_PASS,
  database : 'R20_user_configs'
};

const mysql = require('serverless-mysql')({config});


const quizData = async (payload) => {
  console.log(payload);
  data = {
    qid: payload.qid,
    value: payload.value,
    event: payload.event
  }

  const post = await mysql.query(`INSERT INTO quiz_stats_data SET`+mysql.escape(data)+";");
  await mysql.end();
  return post;
}


module.exports = {
  //getQuiz,
 // getQuestions,
  quizData
};