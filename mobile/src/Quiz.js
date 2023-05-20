import React from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  Linking,
  TouchableOpacity,
  TouchableHighlight,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  Alert
} from 'react-native';
import images from './utils/images';
import Icon from 'react-native-vector-icons/FontAwesome';
import { style } from "./utils/styles";
import { openUrl } from './utils';
import { ListItem, Br, Head, Para, LinkButton, LinkText } from "./utils/Typography";
import Question from "./components/quiz/Question";
import NavBar from "./navigation/NavBar";
import { useData } from './utils/DataContext';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import getQuiz from './api/getQuiz';
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

QUIZ FUNCTIONALITY

The main function is the quizState variable. the states are as follows:

init: call initialiseation routine and either move to ready state or resume state
ready: display quiz choices
start: load question data and move to in progress
resumefromdata: load progress data and move to in progress
inprogress: render questions from questions template and run quiz
endscreen: display user's score and ranking
reset: clear all variables and return to the ready state
resume: show resume screen
error: display if there is a connection error

*/

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
  const [rank, setRank] = React.useState(0);
  const [quizCompleted, setQuizCompleted] = React.useState([]);
  const [preview, setPreview] = React.useState(false);
  const [previewClickCount, setPreviewClickCount] = React.useState(0);
  const [quizResumeQCount, setQuizResumeQCount] = React.useState(0)

  const r20url = "https://www.hobsonsbay.vic.gov.au/Services/Recycling-2.0-Waste-and-recycling-services";


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
        //loadTips(tipsCount);
      break;
      case 'reset':
        resetQuiz();
      break;
      case 'resume':  
        // get questions length for resume button  
        getQuestions(resumeData.q).then((d)=>{
          setQuizResumeQCount(d.length)
        })
      break;
      case 'error':

      break;
    }
  },[quizState])


  // default value mapper for questions (to avoid null issues)
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
    tip: false,
    ...question
  }};


  /* Event that fires when the question in answered
  it used to update the tip categories, but thta feature was deprecated
  setanswers updates an array of answers that are used for processing the results and storing the asyncstorage values for resume functionality
  registeranswer logs the answer with AWS for analytics
  */
  React.useEffect(()=>{
    if(answer.id){
    //   if (!answer.correct){
    //     let tips = {...tipsCount}
    //     if(tips[answer.category]) {
    //       ++tips[answer.category];
    //     }else{
    //       tips[answer.category] = 1;
    //     }
    //     setTipsCount(tips);
    //     console.log("tips",tips)
    //   }
      setAnswers([...answers,answer]);
      registerAnswer(answer.id,answer.answer);
    } 
  },[answer])


  /*
  calculates the score every time the answers are updated
  */
  React.useEffect(()=>{
    let scoreAdd = 0;
    let catAdd = {};
    for(a of answers){
      a.correct && scoreAdd++;
    }
    setScore(scoreAdd);
    answers.length > 0 && registerProgress(answers);
  },[answers])

  // add in a preview function by tapping 5 times on a hidden button to the bottom right of the quiz start buttons
  // this is for debugging quizzes that are not live yet
  React.useEffect(()=>{
    if (previewClickCount >= 5) setPreview(true);
    if (previewClickCount >= 8){
        setPreview(false);
        setPreviewClickCount(0);
      }
  },[previewClickCount])


  // function to advance to the next question
  const nextQuestion = () => {
    let next = questionNumber+1;
    setQuestionNumber(next)
    setCurrentQuestion(questionDefaults(questions[next-1]));
    if (next == questions.length){
      setIsLast(true);
    }
  }

  // fetches the questions from the API and then prepares the quiz for starting
  // also logs a quiz start to AWS
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


  // resets all variables to default values and returns to the quiz select screen
  const resetQuiz = () => {
    setQuizState('init');
    setInProgress(false);
    setIsLast(false);
    setQuiz(null);
    setQuizID(null);
    setQuestions(null);
    setCurrentQuestion(0);
    setAnswers([]);
    setAnswer(nullAnswer);
    setScore(0);
    setTipsCount(null);
    setRank(0);
    setQuizResumeQCount(0);
  }

  // Registers the quiz to asyncstorage and AWS analytics DB
  // sets the quiz id to the current quiz
  const registerQuiz = async (id) => {
    AsyncStorage.setItem('quizInProgress', ""+id).then(()=>{
      return quizAnswersApi(id,'quiz_start',1)
    }).then((val)=>{
      //console.log("started");
    })
  }

  // Registers an answer to the AWS AWS analytics DB
  // logs the answer that was selected, so that analysis can determine how many people got the question right
  const registerAnswer = async (id,answer) => {
    quizAnswersApi(id,'question_answer',answer)
    .then((val)=>{
      //console.log("question answerd");
    })
  }

  // Registers the answers to asyncstorage. used for the resume functionality
  const registerProgress = async (answers) => {
    AsyncStorage.setItem('quizData', JSON.stringify(answers)).then(()=>{
      return true
    })
  }

  /* function to handle all of the quiz finishing 
  removes asyncstorage vals for resumption
  logs quiz end with AWS (posts final score)
  updates asyncstorage with quiz and score
  */
  const finishQuiz = async (id,score) => {
    await AsyncStorage.removeItem('quizInProgress').then(()=>{
      return AsyncStorage.removeItem('quizData');
    }).then(()=>{
      return quizAnswersApi(id,'quiz_end',score)
    }).then((val)=>{
      
    })
    
    /*
    search through completed array
    replace if index exists and score is higher than previous attempt
    */
    let found = false;
    let complete = [...quizCompleted];
    let obj = complete.find((o, i) => {
        if (o.id === id) {
            if (score > o.score) complete[i] = { id: id, score: score };
            found = true;
            return true; // stop searching
        }
    });

    if(!found) complete.push({ id: id, score: score });

    // push updated scores to asyncstorage
    await AsyncStorage.setItem('quizCompleted', JSON.stringify(complete)).then(()=>{
      return true
    })
  }

  // function to call the AWS api for quiz analytics
  const quizAnswersApi = async (id,event,data) => {
    //console.log("api call",id,event,data);
    data = {
      qid: id,
      value: data,
      event: event
    }
    await postQuizData(data).then(()=>{
      return true;
    }).catch((error) => {
      
      return false;
    })
    
  }

  // redundant functions fo tips handling

  // const loadTips = async (tips) => {
  //   const sorted = sortTips(tips);
  //   console.log(sorted);
  //   getTips({categories:sorted}).then((res)=>{
  //     console.log(res);
  //     setTips(res);
  //   }).catch((er)=>{
  //     setTips(null)
  //   })
  // }

  // const sortTips = (tips) => {
  //   return Object.entries(tips).sort((a,b)=>b[1]-a[1]).map(cat=>cat[0]);
  // }

  const loadFromAsync = async () => {
    let completed = await AsyncStorage.getItem('quizCompleted').then((val)=>{
          return (val) ? setQuizCompleted(JSON.parse(val)) : setQuizCompleted([]);
        })
    let inProg = await AsyncStorage.getItem('quizInProgress').then((val)=>{
          return (val) ? val : false;
        })
    let quizData = await AsyncStorage.getItem('quizData').then((val)=>{
        let out = (val) ? JSON.parse(val) : false;
        
        return (out && out.length > 0) && out;
        })
    
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

  const getRank = (score, total) => {
      let rank = 0;
      let endscore = score / total;
      if (endscore > 0) rank = 0;
      if (endscore > 0.1) rank = 1;
      if (endscore > 0.4) rank = 2;
      if (endscore > 0.8) rank = 3;
      return rank;
  }

  const isAttempted = (id) =>{
    quizCompleted.find(o => o.id === id);
  }

  React.useEffect(()=>{
    if(questions) {
      setRank(getRank(score,questions.length));
    }
  },[score])

  const scroll = React.useRef();

  React.useEffect(()=>{
    scroll.current.scrollTo({y:0});
  },[currentQuestion])

  const answerQ = (a) => {
    //scroll.current.scrollTo({y:1000});
    setAnswer(a);
  }



  // handler to override default header bar back button functionality
  const quizBack = () =>{
    if (quizState == 'init' || quizState == 'ready' || quizState == 'error' || quizState == 'resume'){
      navigation.goBack();
    }else if (quizState == 'inprogress' || quizState == 'endscreen'){
      Alert.alert(
        'Exit quiz',
        'Would you like to exit and go back to the main quiz page?',
        [
          { text: 'Cancel', onPress: () => {}, style: 'cancel' },
          { text: 'Yes', onPress: () => clearResume()}
        ]
      );
    }
  }

  // const quizResumeQCount = async (resumeData)=>{
  //   // length = await getQuestions(resumeData.q).then((d)=>{
  //   //   console.log(d);
  //   // });
  //   // console.log(length)
  //   return 10
  // }

  const startButton = (q, index) => {
      // search completed array for attempt and return object
      let attempted = quizCompleted.find(o => o.id === q.id);
      let score = (attempted) ? attempted.score : 0;
      let rank = getRank(score,q.questions);
      if (!q.live && !preview) return false;
      return (
        <View key={q.id}>
          <Head style={styles.quiz_select_head}>{q.name}</Head>
          <TouchableOpacity style={styles.quiz_button_wrap} onPress={()=>startQuiz(q.id)}>
            {!attempted && (
              <View style={styles.quiz_start_button}>
                <View style={styles.quiz_start_button_top}>          
                  <Text style={styles.quiz_start_button_main}>Start</Text>
                  <Text style={styles.quiz_start_button_number}>0/{q.questions}</Text>
                </View>
                <Text style={styles.quiz_start_button_action}>Tap to start quiz.</Text>
              </View>
            )}
            {attempted && (
              <View style={[styles.quiz_start_button,styles.quiz_try_again_button]}>
                <View style={styles.quiz_start_button_top}>
                  <Text style={styles.quiz_start_button_main}>Completed</Text>
                  <View style={{flexDirection: 'row'}}>
                    <Icon name='star' size={18} color={(rank >= 1) ? '#D4AF37' : '#ffffff'} />
                    <Icon name='star' size={18} color={(rank >= 2) ? '#D4AF37' : '#ffffff'} />
                    <Icon name='star' size={18} color={(rank >= 3) ? '#D4AF37' : '#ffffff'} />
                  </View>
                </View>
                <Text style={styles.quiz_start_button_action}>Tap to try again.</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      )
  }

  return (
    <SafeAreaView style={styles.view}>
      <View style={styles.quiz_main}>
        <NavBar quiz={true} backButtonAction={quizBack} navigation={navigation}/>
        <ScrollView ref={scroll} style={styles.newsfeed_scroll} contentContainerStyle={styles.quiz_scroll_content}>
          {quizState == 'init' && (
            <View>
              <Para style={styles.intro_para}>Loading Quiz</Para>
              <ActivityIndicator animating={true} size='large' color='#333333' /> 
            </View>
          )}
          {quizState == 'ready' && (
              <View style={styles.quiz_select_screen}>
                <Head style={styles.blue_head}>Recycling 2.0 Quiz</Head>
                <Para style={styles.intro_para}>Test your recycling knowledge with the quizzes below. Find out your score, learn new things.</Para>
                { quiz.map(startButton) }
                <TouchableHighlight style={styles.hidden_debug_button}
                  activeOpacity={0.6}
                  underlayColor="#DDDDDD"
                  onPress={() => setPreviewClickCount(previewClickCount+1)}>
                  <Text></Text>
                </TouchableHighlight>
              </View>
            )
          }
          {quizState == 'inprogress' && (
            <Question 
              key={questionNumber} 
              nextQuestion={nextQuestion} 
              question={currentQuestion} 
              questionNumber={questionNumber} 
              isLast={isLast}
              progress={questionNumber / questions.length * 100}
              endQuiz= {endQuiz}
              postAnswer={answerQ}
              scrollRef={scroll.current}
              qtotal={questions.length}
            />
          )}
          {quizState == 'endscreen' && (
            <View>
              <Head style={styles.blue_head}>Recycling 2.0 Quiz</Head>
              { rank == 3 && (
                <View>
                  <Text style={styles.end_title}>Congratulations!</Text>
                  <Para style={styles.end_para}>
                    You scored <Text style={{fontWeight:'bold'}}>{score} out of {questions.length}</Text> questions right. Thanks for helping us create a sustainable Hobsons Bay 👏
                  </Para>
                  <Image style={[styles.end_image,{width:307,height:219}]} source={images.quiz_perfect}/>
                </View>
              )}
              { rank == 2 && (
                <View>
                  <Text style={styles.end_title}>Not Bad!</Text>
                  <Para style={styles.end_para}>
                    That’s <Text style={{fontWeight:'bold'}}>{score} out of {questions.length}</Text> questions right. Good job, you’re on your way to becoming a recyling champ.
                  </Para>
                  <Image style={[styles.end_image,{width:280,height:194}]} source={images.quiz_ok}/>

                </View>
              )}
              { rank <= 1 && (
                <View>
                  <Text style={styles.end_title}>Uh oh!</Text>
                  <Para style={styles.end_para}>
                    That’s <Text style={{fontWeight:'bold'}}>{score} out of {questions.length}</Text> questions right. 
Your journey’s just beginning. Level up, and see you in the next quiz!  
                  </Para>
                  <Image style={[styles.end_image,{width:231,height:153}]} source={images.quiz_bad}/>

                </View>
              )}
              <Text style={styles.end_score}>{score}/{questions.length}</Text>
              { rank < 3 && (
                <View>
                  <Text style={styles.end_title}>Level up your recycling skills</Text>
                  <TouchableOpacity onPress={()=>{Linking.openURL(r20url)}}>
                    <Text style={styles.web_link}>Visit the Recycling 2.0 Website</Text>
                  </TouchableOpacity>
                </View>
              )}
              <Br/>
              <TouchableOpacity onPress={()=>setQuizState('reset')}>
                <View style={[styles.quiz_button]}>
                  <Text style={styles.quiz_button_text}>Try another Quiz</Text>
                </View>
              </TouchableOpacity>
              {/* debug buttons for testing quiz ranking
              <TouchableOpacity onPress={()=>setRank(0)}>
                <View style={[styles.quiz_button]}>
                  <Text style={styles.quiz_button_text}>Rank 0</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={()=>setRank(1)}>
                <View style={[styles.quiz_button]}>
                  <Text style={styles.quiz_button_text}>Rank 1</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={()=>setRank(2)}>
                <View style={[styles.quiz_button]}>
                  <Text style={styles.quiz_button_text}>Rank 2</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={()=>setRank(3)}>
                <View style={[styles.quiz_button]}>
                  <Text style={styles.quiz_button_text}>Rank 3</Text>
                </View>
              </TouchableOpacity>
            */}
            </View>
          )}
          {quizState == 'error' && (
            <View>
              <Head style={styles.blue_head}>A Connection Error Occurred</Head>
              <Br/>
              <Br/>
              <TouchableOpacity onPress={()=>setQuizState('reset')}>
                <View style={[styles.quiz_button]}>
                  <Text style={styles.quiz_button_text}>Try again</Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
          {quizState == 'resume' && (
            <View style={styles.quiz_select_screen}>
              <Head style={styles.blue_head}>Recycling 2.0 Quiz</Head>
              <Para style={styles.intro_para}>You have a quiz in progress. Would you like to continue or go to the main quiz page?</Para>
              <TouchableOpacity onPress={()=>resumeQuiz(resumeData)}>
                <View style={[styles.quiz_start_button,styles.quiz_resume_button]}>
                  <View style={styles.quiz_start_button_top}>          
                    <Text style={styles.quiz_start_button_main}>In progress</Text>
                    <Text style={styles.quiz_start_button_number}>{resumeData.d.length}/{quizResumeQCount}</Text>
                  </View>
                  <Text style={styles.quiz_start_button_action}>Tap to contimue</Text>
                </View>
              </TouchableOpacity>
              <Br/>
              <TouchableOpacity onPress={clearResume}>
                <View style={[styles.quiz_button]}>
                  <Text style={styles.quiz_button_text}>Try another Quiz</Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
          {/* debug button to reset all variables to default
          <Br/>
          <TouchableOpacity onPress={()=>setQuizState('reset')}>
            <Head>reset</Head>
          </TouchableOpacity>
        */}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  view: { flex: 1 },
  quiz_main:{
    flex: 1,
  },
  quiz_scroll_content:{
    marginHorizontal: 20,
    flexGrow: 1,
    justifyContent: 'space-between'
  },
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
  blue_head:{
    fontSize: 24,
    color: style.colours.hobsons_blue,
    textAlign: 'center',
    marginBottom: 20
  },
  intro_para : {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20
  },
  quiz_select_screen:{
    flex: 1
  },
  hidden_debug_button:{
    width: 30,
    height: 30,
    //backgroundColor: "#333"
  },
  quiz_select_head: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 10
  },
  quiz_button_wrap:{
    width: 240,
    alignSelf: 'center',
  },
  quiz_start_button: {
    width: 240,
    backgroundColor: style.colours.hobsons_blue,
    borderRadius: 10,
    padding: 10,
    alignSelf: 'center',
    marginBottom: 20,
  },
  quiz_button:{
    width: 240,
    backgroundColor: style.colours.hobsons_blue,
    borderRadius: 10,
    padding: 10,
    alignSelf: 'center',
    marginBottom: 20,
  },
  quiz_button_text:{
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
    color: "#fff"
  },
  quiz_try_again_button:{
    backgroundColor: "#219653",
  },
  quiz_resume_button:{
    backgroundColor: style.colours.purple_glass,
  },
  quiz_start_button_top:{
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: "space-between"
  },
  quiz_start_button_main: {
    flexShrink: 1,
    color: "#fff",
    fontSize: 20,
    fontWeight: 'bold',
    alignSelf: 'flex-start'
  },
  quiz_start_button_number: {
    flexShrink: 1,
    color: "#fff",
    fontSize: 20,
    fontWeight: 'bold',
    alignSelf: 'flex-end'
  },
  quiz_start_button_action: {
    flex: 1,
    flexGrow: 1,
    color: "#fff"
  },
  end_image:{
    alignSelf:'center'
  },
  end_score:{
    textAlign: 'center',
    fontSize: 72,
    fontWeight: 'bold'
  },
  end_title: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20

  },
  end_para: {
    textAlign: 'center',
    fontSize: 18,
    marginBottom: 20
  },
  web_link:{
    color: style.colours.hobsons_blue,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    textDecorationLine: 'underline'
  }

});
