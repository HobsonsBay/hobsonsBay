const fetch = require('isomorphic-fetch');
const join = require('lodash/join');
const map = require('lodash/map');
const get = require('lodash/get');
const admin = require('firebase-admin');
const { utcToZonedTime, format } = require('date-fns-tz');
const startOfHour = require('date-fns/startOfHour');
const formatISO = require('date-fns/formatISO');
const differenceInHours = require('date-fns/differenceInHours')

const {
  APPLICATION_ID,
  API_KEY,
  KNACK_API_URL,
  KNACK_QUIZ_OBJECT_ID,
  KNACK_QUIZ_QUESTIONS_OBJECT_ID,
  AWS_MYSQL_URL,
  AWS_MYSQL_USER,
  AWS_MYSQL_PASS
} = process.env;

const config = {
  host     : AWS_MYSQL_URL,
  user     : AWS_MYSQL_USER,
  password : AWS_MYSQL_PASS,
  database : 'R20_user_configs'
};

const mysql = require('serverless-mysql')({config});

const getQuiz = async () => {

  const RECORDS_URL = `${KNACK_API_URL}${KNACK_QUIZ_OBJECT_ID}/records`;
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-Knack-Application-Id': APPLICATION_ID,
      'X-Knack-REST-API-KEY': API_KEY
    }
  };
  const filters = {
    match: 'and',
    rules: [
      {
        field: 'field_2001',
        operator: 'is',
        value: 10
      }
    ]
  };
  const order = {
    //?sort_field=field_25&sort_order=desc
    sort_field: "",
    sort_order: ""
  }
  const query = {
    page: 1,
    rows_per_page: 1000,
    format: 'raw',
    sort_field: "field_2957",
    sort_order: "asc"
    //filters: encodeURIComponent(JSON.stringify(filters))
  };

  const QUERY = join(map(query, (value, key) => `${key}=${value}`), '&');
  const json = await fetch(`${RECORDS_URL}?${QUERY}`, options).then((response) => response.json());
  return fieldMapperQuiz(json).rows;
}


const fieldMapperQuiz = ({ records }) => {
  const rows = map(records, (rec) => {

    return {
      id: get(rec, 'id'),
      name: get(rec, 'field_2878'),
      questions: get(rec, 'field_2927'),
      live: get(rec, 'field_2881'),
    };
  });

  return { rows };
};


const getQuestions = async (id) => {

  const RECORDS_URL = `${KNACK_API_URL}${KNACK_QUIZ_QUESTIONS_OBJECT_ID}/records`;
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-Knack-Application-Id': APPLICATION_ID,
      'X-Knack-REST-API-KEY': API_KEY
    }
  };
  const filters = {
    match: 'and',
    rules: [
      {
        field: 'field_2896',
        operator: 'is',
        value: id
      }
    ]
  };
  const query = {
    page: 1,
    rows_per_page: 1000,
    format: 'raw',
    filters: encodeURIComponent(JSON.stringify(filters))
  };

  const QUERY = join(map(query, (value, key) => `${key}=${value}`), '&');
  const json = await fetch(`${RECORDS_URL}?${QUERY}`, options).then((response) => response.json());
  return fieldMapperQuestions(json).rows;
}


const fieldMapperQuestions = ({ records }) => {

  const rows = map(records, (rec) => {

    return {
      id: get(rec, 'field_2894'),
      question: get(rec, 'field_2895'),
      quiz_id: get(rec, 'field_2896[0].id', null),
      image: get(rec, 'field_2897.url', null),
      answer_1: get(rec, 'field_2898'),
      answer_2: get(rec, 'field_2899'),
      answer_3: get(rec, 'field_2900'),
      answer_4: get(rec, 'field_2901'),
      correct_answer: get(rec, 'field_2902'),
      category: get(rec, 'field_2903'),
      tip: get(rec, 'field_2904'),
    };
  });

  return { rows };
};


const quizData = async (payload) => {
 let data = {
    qid: payload.qid,
    value: payload.value,
    event: payload.eventr
  }

  const post = await mysql.query(`INSERT INTO quiz_stats_data SET`+mysql.escape(data)+";");
  await mysql.end();
  return post;
}


export {
  getQuiz,
  getQuestions,
  quizData
};