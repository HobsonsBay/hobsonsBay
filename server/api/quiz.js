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
        id: "5",
        question : "What is wrong with this kitchen caddy?",
        image : "",
        answer_1 : "Should use double plastic bin liners to ensure no leakage",
        answer_2 : "Nothing, everything looks ok",
        answer_3 : "Items should be placed in the caddy loose, not plastic or compostable bin liners allowed",
        answer_4 : "Should use a compostable plastic bin liner",
        correct_answer : "3",
        category : "FOGO"
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
      },{
        "id" : "10",
        "question" : "What happens to the contents of my FOGO bin?",
        "answer_1" : "Goes to landfill",
        "answer_2" : "Fed to pigs",
        "answer_3" : "Turned into compost",
        "answer_4" : "None of the above",
        "correct_answer": "3",
        "category" : "FOGO"
      },{
        "id" : "11",

        "question" : "What should you do with seafood and fish bones",
        "answer_1" : "Throw them outside for the local cats to eat",
        "answer_2" : "Put them in the garbage bin",
        "answer_3" : "Place them in the FOGO bin",
        "answer_4" : "None of the above",
        "correct_answer": "3",
        "category" : "FOGO"
      },{
        "id" : "12",

        "question" : "The following items cannot go in my FOGO bin",
        "answer_1" : "Tea bags",
        "answer_2" : "Citrus fruits",
        "answer_3" : "Onions",
        "answer_4" : "Garden weeds",
        "correct_answer": "1",
        "category" : "FOGO"
      },{
        "id" : "13",

        "question" : "You can put raw meat bones in your FOGO bin (image)",
        "answer_1" : "True",
        "answer_2" : "False",
        "correct_answer": "1",
        "category" : "FOGO"
      },{
        "id" : "14",

        "question" : "What is wrong with this kitchen caddy? (image of caddy with plastic bin liner)",
        "answer_1" : "Should use double plastic bin liners to ensure no leakage",
        "answer_2" : "Nothing, everything looks ok",
        "answer_3" : "Items should be placed in the caddy loose, not plastic or compostable bin liners allowed ",
        "answer_4" : "Should use a compostable plastic bin liner",
        "correct_answer": "3",
        "category" : "FOGO"
      },{
        "id" : "15",

        "question" : "To reduce odours and mess, its ok to wrap your food scraps in one or two layers of newspaper",
        "answer_1" : "False",
        "answer_2" : "True",
        "correct_answer": "2",
        "category" : "FOGO"
      },{
        "id" : "16",

        "question" : "What should you do with your coffee grounds and loose tea leaves?",
        "answer_1" : "Throw in garbage bin",
        "answer_2" : "Tip them down the sink",
        "answer_3" : "Throw them in the neighbour’s yard",
        "answer_4" : "Place in the FOGO bin",
        "correct_answer": "4",
        "category" : "FOGO"
      },{
        "id" : "17",

        "question" : "Branches and logs over 50cm are fine to place in the FOGO bin",
        "answer_1" : "True",
        "answer_2" : "False",
        "correct_answer": "2",
        "category" : "FOGO"
      },{
        "id" : "18",

        "question" : "My FOGO bin gets collected:",
        "answer_1" : "Fortnightly",
        "answer_2" : "Weekly",
        "answer_3" : "Whenever I put it out",
        "answer_4" : "Monthly",
        "correct_answer": "2",
        "category" : "FOGO"
      },{
        "id" : "19",

        "question" : "Soil is organic, so it should go in the FOGO bin",
        "answer_1" : "True",
        "answer_2" : "False",
        "correct_answer": "2",
        "category" : "FOGO"
      }];
      break;
    case 'getTips':
      console.log(body);
      let id = 0;
      data = []
      for(category of body.categories){
        console.log(category);
        id++;
        data.push({
          id : id,
          text: "a tip for "+category,
          url: "https://google.com",
          category: category
        })
      }
      // data = [{
      //   id : "1",
      //   text: "an example tip",
      //   url: "https://google.com",
      //   category: "FOGO"
      // },{
      //   id : "2",
      //   text: "an example tip",
      //   url: "https://google.com",
      //   category: "FOGO"
      // },{
      //   id : "3",
      //   text: "an example tip",
      //   url: "https://google.com",
      //   category: "FOGO"
      // },{
      //   id : "4",
      //   text: "an example tip",
      //   url: "https://google.com",
      //   category: "FOGO"
      // },{
      //   id : "5",
      //   text: "an example tip",
      //   url: "https://google.com",
      //   category: "FOGO"
      // }];
      break;
    case 'quizData':
      data = await quizData(body);
      break;
  }
  res.status(200).send(data);
};