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
import { style } from "../../utils/styles";
import { ListItem, Br, Head, Para, LinkButton } from "../../utils/Typography";
import images from '../../utils/images';
import AsyncStorage from '@react-native-async-storage/async-storage';

/* QUESTION COMPONENT
  Handles the functionality for the question item

*/


export default (props) => {
  const { 
    navigation, 
    route, 
    question, 
    questionNumber, 
    nextQuestion, 
    isLast, 
    endQuiz,
    postAnswer,
    progress,
    qtotal,
    scrollRef
  } = props;
  const [answer, setAnswer] = React.useState({a:false,c:false});
  const {correct_answer,category} = question;
  const [correct, setCorrect] = React.useState(false);
  const [wrong, setWrong] = React.useState(false);
  const [next, setNext] = React.useState(false);
  const [imgSize, setImgSize] = React.useState({width:0,height:0});

  // React.useEffect(()=>{
  //   question.image = (question.image && question.image.length > 1) ? question.image : false;
  //   if(question.image){
  //     Image.getSize(question.image, (w,h)=>{
  //       const aspect = w/h;
  //       console.log('image success',w,h,aspect)
  //       setImgSize({width:0,height:0});
  //     });
  //   }  
  // },[question])

  //console.log(question)

  React.useEffect(()=>{
    console.log("console.log",answer && answer.a, correct_answer)
    if(answer.a && answer.a == correct_answer){
      postAnswer(answerData(true,answer));
      //console.log('correct')
      setCorrect(true);
      setWrong(false);
      setNext(true);
    }else if (answer.a && answer.a != correct_answer){
      postAnswer(answerData(false,answer));
      //console.log('wrong')
      setCorrect(false);
      setWrong(true);
      setNext(true);
    }else{
      //console.log('void')
    }
  },[answer])

  const scrollToBottom = (e) => {
    scrollRef.scrollTo({y:1000})
  }



  const answerData = React.useCallback((correct,answer) => {
    /* feed back answer data to quiz template
      Fields:
      ID
      Correct
      Answer
      Category
    */
    let data = {
      id: question.id,
      correct: correct,
      answer: answer.a,
      category: answer.c
    }

    console.log(data);
    return data;

  },[answer])

  const answerColor = (id) => {

    if(answer.a && id == correct_answer){
      // turn green if correct answer selected or shown if answer is wrong
      return {backgroundColor:"#9ACA3C"};
    }else if (answer.a == id && id != correct_answer){
      // turn red if wrong answer selected
      return {backgroundColor:"#E63C38"};
    }else{
      // default colour
      return {backgroundColor:"transparent"};
    }    
  }

  const progressWidth = () => {
    return 50
  }

  return (
    <View style={styles.question_container} id={question.id.toString()}>
      <View>
        {isLast && <Head style={styles.finalq}>Final Question!</Head>}
        <View style={styles.progress_container}>
          <View style={[styles.progress_line,{width: progress+"%"}]}>
            { progress > 50 && <Text style={styles.progress_qs_white}>{questionNumber} of {qtotal}</Text> }
            <Image style={styles.truck_icon} source={images.truck}/>
          </View>
          { progress <= 50 && <Text style={styles.progress_qs_black}>{questionNumber} of {qtotal}</Text> }
        </View>
      </View>

      <Para style={styles.question_text}>{question.question}</Para>

      {question.image && (
        <View style={styles.q_photo}>
          <Image style={styles.q_photo_img} source={{ uri: question.image }} resizeMode='contain'/>
        </View>
      )}

      <View style={styles.answerText}>
        {correct && (<View style={styles.result}>
          <Image style={styles.result_image} source={images.answer_right}/>
          <Head>Correct!</Head>
        </View> )}
        {wrong && (<View style={styles.result}>
          <Image style={styles.result_image} source={images.answer_wrong}/>
          <Head>Incorrect</Head>
        </View> )}
        {next && <Para style={styles.tip}>{question.tip}</Para>}
      </View>
      <View style={styles.question_block}>
      {question.answer_1.length > 0 && (
        <TouchableOpacity 
          disabled={answer.a ? true : false}
          style={[styles.answerButton,answerColor(1)]} 
          onPress={()=>setAnswer({a:1,c:category})}
        >
          <Text style={styles.answer_circle}>a</Text>
          <Head style={styles.answer_text}>{question.answer_1}</Head>
        </TouchableOpacity>
      )}

      {question.answer_2.length > 0 && (
        <TouchableOpacity 
          disabled={answer.a ? true : false}
          style={[styles.answerButton,answerColor(2)]} 
          onPress={()=>setAnswer({a:2,c:category})}
        >
          <Text style={styles.answer_circle}>b</Text>
          <Head style={styles.answer_text}>{question.answer_2}</Head>
        </TouchableOpacity>
      )}

      {question.answer_3.length > 0 && (
        <TouchableOpacity 
          disabled={answer.a ? true : false}
          style={[styles.answerButton,answerColor(3)]} 
          onPress={()=>setAnswer({a:3,c:category})}
        >
          <Text style={styles.answer_circle}>c</Text>
          <Head style={styles.answer_text}>{question.answer_3}</Head>
        </TouchableOpacity>
      )}
      
      {question.answer_4.length > 0 && (
        <TouchableOpacity 
          disabled={answer.a ? true : false}
          style={[styles.answerButton,answerColor(4)]} 
          onPress={()=>setAnswer({a:4,c:category})}
        >
          <Text style={styles.answer_circle}>d</Text>
          <Head style={styles.answer_text}>{question.answer_4}</Head>
        </TouchableOpacity>
      )}
      <Br/>
      </View>

      {!isLast && answer.a && (
        <TouchableOpacity onPress={nextQuestion}>
          <View onLayout={scrollToBottom} style={[styles.quiz_button]}>
            <Text style={styles.quiz_button_text}>Next ></Text>
          </View>
        </TouchableOpacity>
      )}
      {isLast && answer.a && (
        <React.Fragment>
          <Head style={{textAlign:'center',marginTop:15}}>You have finished the quiz!</Head>
          <TouchableOpacity onPress={endQuiz}>
            <View onLayout={scrollToBottom} style={[styles.quiz_button]}>
              <Text style={styles.quiz_button_text}>See Your Score!</Text>
            </View>
          </TouchableOpacity>
        </React.Fragment>
      )}

      <Br/>
    </View>
  );
};

const styles = StyleSheet.create({
  view: { flex: 1 },
  question_container: {
    flex: 1,
    justifyContent: 'space-between'
  },
  q_photo: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 240,
    marginBottom: 30
  },
  q_photo_img: {
    height: '100%',
    width: '100%'
  },
  finalq:{
    textAlign: 'center',
    color: style.colours.hobsons_blue
  },
  progress_container:{
    height: 20,
    margin: 10,
    borderRadius: 10,
    backgroundColor: "#EAE8E8",
  },
  progress_line:{
    height: 20,
    borderRadius: 10,
    backgroundColor: style.colours.purple_glass,
    position: 'relative',
  },
  truck_icon:{
    position: 'absolute',
    width: 36,
    height: 24,
    top: -2,
    right: -8,
  },
  progress_qs_white:{
    color: "#fff",
    position: "absolute",
    left: 20
  },
  progress_qs_black:{
    color: "#333",
    position: "absolute",
    right: 20
  },
  question_text:{
    fontSize: 24,
    lineHeight: 30,
    textAlign: 'center',
    marginVertical: 20,
  },
  result:{
    flexDirection: "row",
    marginBottom: 5,
    alignItems: 'center'
  },
  result_image:{
    width: 40,
    height: 40,
    marginRight: 15
  },
  tip:{
    marginBottom: 15
  },
  answerButton: {
    flexShrink: 1,
    padding: 10,
    margin: 5,
    borderColor: style.colours.hobsons_blue,
    borderWidth: 2,
    borderRadius: 10,
    flexDirection: "row"
  },
  answer_circle:{
    width: 25,
    height: 25,
    borderRadius: 13,
    // borderColor: "rgba(255,255,255,0.4)",
    // borderWidth: 2,
    color: "#fff",
    backgroundColor: style.colours.hobsons_blue,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    fontWeight: 'bold',
    lineHeight: 24,
    marginRight: 10,
    overflow: 'hidden'
  },
  answer_text: {
    flex: 1
  },
  answerText:{
    textAlign: 'center'
  },
  quiz_button:{
    width: 240,
    backgroundColor: style.colours.hobsons_blue,
    borderRadius: 10,
    padding: 10,
    alignSelf: 'center',
    marginTop: 20,
  },
  quiz_button_text:{
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
    color: "#fff"
  },

});
