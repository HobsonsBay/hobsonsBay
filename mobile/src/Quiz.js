import React from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ActivityIndicator
} from 'react-native';
import { style } from "./utils/styles";
import { openUrl } from './utils';
import { ListItem, Br, Head, Para, LinkButton, LinkText } from "./utils/Typography";
import Question from "./components/quiz/Question";
import NavBar from "./components/navigation/NavBar";
import { useData } from './utils/DataContext';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import getQuiz from './api/getQuiz';
import getTips from './api/getTips';
import getQuestions from './api/getQuestions';
import postQuizData from './api/postQuizData';

/* QUIZ COMPONENT
MVP:
20 questions
Multi choice (4 answers)
Image in question
End screen with score and links to find out more

MVP+:
sets of questions (easy medium hard)
categorised per service

VALUE ADDS:
share to facebook:
Compare to area
Different end screen for score
Did you know tips at end


requirements:
quiz file to be derived from a Agility database
fields returned will be:
- id
- question
- image
- answer a
- answer b
- answer c
- answer d
- correct answer
- category

possible quiz types will link to questions db

possible database for tips to show at end (linked to category)

consider having an AWS db to keep track of zone and question and answer

*/

// const quizData = [{
//   id : "1",
//   name : "easy quiz"
// },{
//   id : "2",
//   name : "medium quiz"
// },{
//   id : "3",
//   name : "hard quiz"
// }]

const debugQuestion = [{
        id: "5",
        question : "What is wrong with this kitchen caddy?",
        image : "",
        answer_1 : "Should use double plastic bin liners to ensure no leakage",
        answer_2 : "Nothing, everything looks ok",
        answer_3 : "Items should be placed in the caddy loose, not plastic or compostable bin liners allowed",
        answer_4 : "Should use a compostable plastic bin liner",
        correct_answer : "3",
        category : "Mixed Recycling"
      }]

export default (props) => {
  const { navigation, route } = props;
  const [inProgress, setInProgress] = React.useState(false);
  const [quiz, setQuiz] = React.useState(null);
  const [quizID, setQuizID] = React.useState(null);
  const [questions, setQuestions] = React.useState(null);
  const [questionNumber, setQuestionNumber] = React.useState(null);
  const [quizState, setQuizState] = React.useState('init');
  const [currentQuestion, setCurrentQuestion ] = React.useState(false);
  const [isLast, setIsLast ] = React.useState(false);
  const [answers, setAnswers] = React.useState([]);
  const nullAnswer = {
      id: false,
      correct: false,
      answer: false,
      category: false,
    };
  const [answer, setAnswer] = React.useState(nullAnswer);
  const [score, setScore] = React.useState(0);
  const [resumeData, setResumeData] = React.useState(null);
  const [tipsCount, setTipsCount] = React.useState(null);
  const [tips, setTips] = React.useState(null);


  //Main Quiz state manager
  React.useEffect(()=>{
    switch (quizState){
      case 'init':
        loadFromAsync().then((resume)=>{
          if(resume){
            setQuizState('resume');
          }else{
            getQuiz().then((data)=>{
              setQuiz(data);
              setQuizState('ready');
            }).catch((er)=>{
              setQuizState('error');
            })
          }
        })
      break;
      case 'start':
        setQuestionNumber(1)
        setCurrentQuestion(questionDefaults(questions[0]))
        setIsLast(false);
        setQuizState('inprogress');
      break;
      case 'resumefromdata':
        let current = resumeData.d.length
        setAnswers(resumeData.d)
        if (current >= questions.length){
          setQuizState('endscreen');
        }else{
          setQuestionNumber(current+1)
          setCurrentQuestion(questionDefaults(questions[current]))
          if (current+1 == questions.length){
            setIsLast(true);
          }else{
            setIsLast(false);
          }
          setQuizState('inprogress');
        }
      break;
      case 'inprogress':

      break;
      case 'endscreen':
        finishQuiz(quizID,score);
        loadTips(tipsCount);
      break;
      case 'reset':
        resetQuiz();
      break;
      case 'resume':

      break;
      case 'error':

      break;
    }
  },[quizState])

  const questionDefaults = (question) => {return {
    id: false,
    question: false,
    image: false,
    answer_1: false,
    answer_2: false,
    answer_3: false,
    answer_4: false,
    correct_answer: false,
    category: false,
    ...question
  }};


  React.useEffect(()=>{
    if(answer.id){
      if (!answer.correct){
        let tips = {...tipsCount}
        if(tips[answer.category]) {
          ++tips[answer.category];
        }else{
          tips[answer.category] = 1;
        }
        setTipsCount(tips);
        console.log("tips",tips)
      }
      setAnswers([...answers,answer]);
      registerAnswer(answer.id,answer.answer);
    } 
  },[answer])

  React.useEffect(()=>{
    let scoreAdd = 0;
    let catAdd = {};
    for(a of answers){
      a.correct && scoreAdd++;
    }
    setScore(scoreAdd);
    answers.length > 0 && registerProgress(answers);
  },[answers])


  const nextQuestion = () => {
    let next = questionNumber+1;
    console.log('next',next, questions.length);
    setQuestionNumber(next)
    setCurrentQuestion(questionDefaults(questions[next-1]));
    if (next == questions.length){
      setIsLast(true);
    }
  }

  const startQuiz = (id) => {
    getQuestions(id).then((qData)=>{
      setQuizID(id);
      setQuestions(qData);
      setQuizState('start');
      registerQuiz(id);
    }).catch((er)=>{
      setQuizState('error');
    })
  }

  const endQuiz = () => {
      setQuizState('endscreen');
  }

  const resetQuiz = () => {
    setInProgress(false);
    setIsLast(false);
    setQuiz(null);
    setQuizID(null);
    setQuestions(null);
    setCurrentQuestion(0);
    setAnswers([]);
    setAnswer(nullAnswer);
    setScore(0);
    setQuizState('init');
    setTipsCount(null);
    setTips(null);
  }

  const registerQuiz = async (id) => {
    AsyncStorage.setItem('quizInProgress', ""+id).then(()=>{
      return quizAnswersApi(id,'quiz_start',1)
    }).then((val)=>{
      console.log("started");
    })
  }

  const registerAnswer = async (id,answer) => {
    quizAnswersApi(id,'question_answer',answer)
    .then((val)=>{
      console.log("question answerd");
    })
  }

  const registerProgress = async (answers) => {
    AsyncStorage.setItem('quizData', JSON.stringify(answers)).then(()=>{
      return true
    })
  }

  const finishQuiz = async (id,score) => {
    await AsyncStorage.removeItem('quizInProgress').then(()=>{
      return AsyncStorage.removeItem('quizData');
    }).then(()=>{
      return quizAnswersApi(id,'quiz_end',score)
    }).then((val)=>{
      console.log("finished");
    })
  }

  const quizAnswersApi = async (id,event,data) => {
    console.log("api call",id,event,data);
    data = {
      qid: id,
      value: data,
      event: event
    }
    await postQuizData(data).then(()=>{
      return true;
    }).catch((error) => {
      console.log(error);
      return false;
    })
    
  }

  const loadTips = async (tips) => {
    const sorted = sortTips(tips);
    console.log(sorted);
    getTips({categories:sorted}).then((res)=>{
      console.log(res);
      setTips(res);
    }).catch((er)=>{
      setTips(null)
    })
  }

  const sortTips = (tips) => {
    return Object.entries(tips).sort((a,b)=>b[1]-a[1]).map(cat=>cat[0]);
  }

  const loadFromAsync = async () => {
    let inProg = await AsyncStorage.getItem('quizInProgress').then((val)=>{
          return (val) ? parseInt(val) : false;
        })
    let quizData = await AsyncStorage.getItem('quizData').then((val)=>{
        let out = (val) ? JSON.parse(val) : false;
        console.log(out);
        return (out && out.length > 0) && out;
        })
    console.log('load from async',inProg,quizData);
    if (inProg && quizData){
      setResumeData({q:inProg,d:quizData})
      return true
    } else{
      return false
    }
  }

  const resumeQuiz = React.useCallback(()=>{

    getQuestions(resumeData.q).then((qData)=>{
      setQuizID(resumeData.q);
      setQuestions(qData);
      setQuizState('resumefromdata');
    }).catch((er)=>{
      setQuizState('error');
    })
  },[resumeData])

  const clearResume = async () => {
    await AsyncStorage.removeItem('quizInProgress').then(()=>{
      return AsyncStorage.removeItem('quizData');
    }).then(()=>{
      resetQuiz();
    })
  }

  return (
    <SafeAreaView style={styles.view}>
      <View style={styles.newsfeed}>
        <NavBar navigation={navigation}/>
        <ScrollView style={styles.newsfeed_scroll} contentContainerStyle={styles.newsfeed_scroll_content}>
          {quizState == 'init' && (
            <Text>Loading Quiz</Text>
          )}
          {quizState == 'ready' && 
            quiz.map((q, index) => (
              <View key={q.id}>
                <TouchableOpacity onPress={()=>startQuiz(q.id)}>
                  <Head>{q.name}</Head>
                </TouchableOpacity>
              </View>
            ))
          }
          {quizState == 'inprogress' && (
            <Question 
              key={questionNumber} 
              nextQuestion={nextQuestion} 
              question={currentQuestion} 
              questionNumber={questionNumber} 
              isLast={isLast}
              endQuiz= {endQuiz}
              postAnswer={setAnswer}
            />
          )}
          {quizState == 'endscreen' && (
            <View>
              <Head>Quiz Finished</Head>
              <Head>{score}/{questions.length}</Head>
              <Head>Tips</Head>
              {tips && tips.map((t, index) => (
                <LinkText key={index} onPress={()=>{ openUrl(t.url) }}>{t.text}</LinkText>
              ))}
            </View>
          )}
          {quizState == 'error' && (
            <View>
              <Head>A Connection Error Occurred</Head>
              <Para>Please try again later</Para>
            </View>
          )}
          {quizState == 'resume' && (
            <View>
              <Head>You have a quiz in progress</Head>
              <Para>Would you like to resume from where you left off?</Para>

              <TouchableOpacity onPress={()=>resumeQuiz(resumeData)}>
                <Head>Yes</Head>
              </TouchableOpacity>
              <TouchableOpacity onPress={clearResume}>
                <Head>No</Head>
              </TouchableOpacity>
            </View>
          )}
          <Br/>
          <TouchableOpacity onPress={()=>setQuizState('reset')}>
            <Head>reset</Head>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  view: { flex: 1 },
  q_photo: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 180,
    marginBottom: 30
  },
  q_photo_img: {
    height: '100%',
    width: '100%'
  },

});
