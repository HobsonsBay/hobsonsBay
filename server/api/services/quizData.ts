const config = {
  host: "hbrdsmysqldb.cz0p0qlqs1ze.ap-southeast-2.rds.amazonaws.com",
  user: "kalihb",
  password: "Hb$ym3Ki2520",
  database: "R20_user_configs",
};
const mysql = require("serverless-mysql")({ config });

type QuizData = {
  qid: String;
  value: number;
  event: String;
};
const quizData = async (payload: QuizData) => {
  let data: QuizData = {
    qid: payload.qid,
    value: payload.value,
    event: payload.event,
  };
  const post = await mysql.query(
    `INSERT INTO quiz_stats_data SET` + mysql.escape(data) + ";"
  );
  await mysql.end();
  return post;
};

export { quizData };
