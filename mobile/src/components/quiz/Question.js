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
import AsyncStorage from '@react-native-community/async-storage';

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
    postAnswer
  } = props;
  const [answer, setAnswer] = React.useState({a:false,c:false});
  const {correct_answer,category} = question;
  const [correct, setCorrect] = React.useState(false);
  const [wrong, setWrong] = React.useState(false);
  const [next, setNext] = React.useState(false);

  React.useEffect(()=>{
    console.log(answer.a, correct_answer)
    if(answer.a && answer.a == correct_answer){
      postAnswer(answerData(true,answer));
      console.log('correct')
      setCorrect(true);
      setWrong(false);
      setNext(true);
    }else if (answer.a && answer.a != correct_answer){
      postAnswer(answerData(false,answer));
      console.log('wrong')
      setCorrect(false);
      setWrong(true);
      setNext(true);
    }else{
      console.log('void')
    }
  },[answer])

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
      return {backgroundColor:"#0a0"};
    }else if (answer.a == id && id != correct_answer){
      // turn red if wrong answer selected
      return {backgroundColor:"#a00"};
    }else{
      // default colour
      return {backgroundColor:"#aaa"};
    }    
  }

  return (
    <View id={question.id}>
      {!isLast ? (<Head>Question number {questionNumber}</Head>) : (<Head>Final Question!</Head>)}
      {question.image && (
        <View style={styles.q_photo}>
          <Image style={styles.q_photo_img} source={{ uri: question.image }} resizeMode='contain'/>
        </View>
      )}
      <Para>{question.question}</Para>
      <TouchableOpacity 
        disabled={answer.a}
        style={[styles.answerButton,answerColor(1)]} 
        onPress={()=>setAnswer({a:1,c:category})}
      >
        <Head>{question.answer_1}</Head>
      </TouchableOpacity>
      <TouchableOpacity 
        disabled={answer.a}
        style={[styles.answerButton,answerColor(2)]} 
        onPress={()=>setAnswer({a:2,c:category})}
      >
        <Head>{question.answer_2}</Head>
      </TouchableOpacity>
      <TouchableOpacity 
        disabled={answer.a}
        style={[styles.answerButton,answerColor(3)]} 
        onPress={()=>setAnswer({a:3,c:category})}
      >
        <Head>{question.answer_3}</Head>
      </TouchableOpacity>
      <TouchableOpacity 
        disabled={answer.a}
        style={[styles.answerButton,answerColor(4)]} 
        onPress={()=>setAnswer({a:4,c:category})}
      >
        <Head>{question.answer_4}</Head>
      </TouchableOpacity>
      <View style={styles.answerText}>
        {correct && <Head>Correct!</Head> }
        {wrong && <Head>Wrong Answer</Head> }
      </View>
      {!isLast && answer.a && (
        <TouchableOpacity onPress={nextQuestion}>
          <Head>Next Question ></Head>
        </TouchableOpacity>
      )}
      {isLast && answer.a && (
        <TouchableOpacity onPress={endQuiz}>
          <Head>See Your Score!</Head>
        </TouchableOpacity>
      )}
    </View>
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
  answerButton: {
    padding: 10,
    margin: 5,
    backgroundColor: "#aaa"
  },
  answerText:{
    textAlign: 'center'
  }

});
