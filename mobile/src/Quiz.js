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
import { ListItem, Br, Head, Para, LinkButton } from "./utils/Typography";
import Question from "./components/quiz/Question";
import NavBar from "./components/navigation/NavBar";
import { useData } from './utils/DataContext';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';

/* QUIZ COMPONENT
MVP:
20 questions
Multi choice (4 answers)
Image in question
End screen with score and links to fin out more

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

const quizData = [{
  id : "1",
  name : "easy quiz"
},{
  id : "2",
  name : "medium quiz"
},{
  id : "3",
  name : "hard quiz"
}]

const questionsData = [{
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
  answer_1 : "Food and Garden",
  answer_2 : "Rubbish",
  answer_3 : "Mixed Recycling",
  answer_4 : "Glass",
  correct_answer : "3",
  category : "Mixed Recycling"
}]

export default (props) => {
  const { navigation, route } = props;
  const [inProgress, setInProgress] = React.useState(false);
  const [quiz, setQuiz] = React.useState(null);
  const [questions, setQuestions] = React.useState(null);
  const [questionNumber, setQuestionNumber] = React.useState(null);
  const [quizState, setQuizState] = React.useState('init');
  const [currentQuestion, setCurrentQuestion ] = React.useState(false);
  const [isLast, setIsLast ] = React.useState(false);
  const [answers, setAnswers] = React.useState([]);
  const [answer, setAnswer] = React.useState({a:false,c:false});

  React.useEffect(()=>{
    switch (quizState){
      case 'init':
        getQuiz().then((data)=>{
          setQuiz(data);
          setQuizState('ready');
        })
      break;
      case 'start':
        setQuestionNumber(1)
        setCurrentQuestion(questions[0])
        setIsLast(false);
      break;
      case 'endscreen':

      break;
      case 'reset':
        setInProgress(false);
        setIsLast(false);
        setQuiz(null);
        setQuestions(null);
        setCurrentQuestion(0);
        setAnswers([]);
        setAnswer({id:false,a:false});
        setQuizState('init');
      break;
    }
  },[quizState])

  const nextQuestion = () => {
    let next = questionNumber+1;
    console.log('next',next, questions.length);
    setQuestionNumber(next)
    setCurrentQuestion(questions[next-1])
    if (next == questions.length){
      setIsLast(true);
    }
  }

  const getQuiz = async () => {
    return quizData;
  }

  const getQuestions = async (id) => {
    return questionsData;
  }

  const startQuiz = (id) => {
    getQuestions(id).then((qData)=>{
      setQuestions(qData);
      setQuizState('start');
    })
  }

  const endQuiz = () => {
      setQuizState('endscreen');
  }

  const loadQuestion = () => {
    return <Question nextQuestion={nextQuestion} question={currentQuestion} questionNumber={questionNumber}/>
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
          {quizState == 'start' && (
            <Question 
              key={questionNumber} 
              nextQuestion={nextQuestion} 
              question={currentQuestion} 
              questionNumber={questionNumber} 
              isLast={isLast}
              endQuiz= {endQuiz}
            />
          )}
          {quizState == 'endscreen' && (
            <View>
              <Head>Quiz Finished</Head>
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
