const { quizData } = require('./_services/quiz');

module.exports = async (req, res) => {
  const { action } = req.query;
  const { body } = req;
  let data = [];

  switch (action) {
    case 'getQuiz':
      data = [{
        id : "1",
        name : "easy quiz",
        questions: "2"
      },{
        id : "2",
        name : "medium quiz",
        questions: "10"
      },{
        id : "3",
        name : "hard quiz",
        questions: "10"
      }];
      break;
    case 'getQuestions':
      data = [{
        id: "1",
        question : "Which bin does this go in?",
        image : "https://s3-ap-southeast-2.amazonaws.com/ap-southeast-2-assets.knack.com/assets/5cf7091b790be9000a691701/5e717096e712ae0015d7e9be/thumb_18/bottlesglass02_v1.png",
        answer_1 : "Mixed Recycling",
        answer_2 : "Glass",
        answer_3 : "Food and Garden",
        answer_4 : "Rubbish",
        correct_answer : "2",
        category : "Glass"
      },{
        id: "2",
        question : "A longer example of a text based question here to see what it looks like on screen.\n\nPick a bin from below",
        answer_1 : "True",
        answer_2 : "False",
        answer_3 : "",
        answer_4 : "",
        correct_answer : "2",
        category : "Mixed Recycling"
      },{
        id: "3",
        question : "Which plastic codes can be recycled in your yellow recycling bin?",
        answer_1 : "1 to 7",
        answer_2 : "6 & 7 only",
        answer_3 : "1, 2 and 5",
        answer_4 : "all of the above",
        correct_answer : "3",
        category : "Mixed Recycling"
      },{
        id: "4",
        question : "Which bin should this item be placed in?",
        image : "https://s3-ap-southeast-2.amazonaws.com/ap-southeast-2-assets.knack.com/assets/5cf7091b790be9000a691701/5e6adaeeb6e1ad001566bea9/thumb_18/metal02_v1.png",
        answer_1 : "FOGO",
        answer_2 : "Rubbish",
        answer_3 : "Glass",
        answer_4 : "",
        correct_answer : "2",
        category : "Mixed Recycling"
      }];
      break;
    case 'quizData':
      data = await quizData(body);
      break;
  }
  res.status(200).send(data);
};