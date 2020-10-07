const { getQuiz, getQuestions, quizData } = require('./_services/quiz');

module.exports = async (req, res) => {
  const { action, quizid } = req.query;
  const { body } = req;
  let data = [];

  switch (action) {
    case 'getQuiz':
      data = await getQuiz();
      break;
    case 'getQuestions':
      data = await getQuestions(quizid);
    break;
    case 'quizData':
      data = await quizData(body);
      break;
  }
  res.status(200).send(data);
};