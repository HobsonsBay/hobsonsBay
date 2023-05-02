import React, {useCallback, useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  TouchableOpacity,
  ScrollView,
  ViewStyle,
} from 'react-native';
import {style} from '../../utils/styles';
import {Br, Head, Para} from '../../utils/Typography';
import images from '../../utils/images';

/* QUESTION COMPONENT
  Handles the functionality for the question item
*/
interface IQuestion {
  question: any;
  questionNumber: number;
  nextQuestion: () => void;
  isLast: boolean;
  endQuiz: () => void;
  postAnswer: (data: any) => void;
  progress: number;
  qtotal: number;
  scrollRef: React.RefObject<ScrollView>;
}

const Question: React.FC<IQuestion> = ({
  question,
  questionNumber,
  nextQuestion,
  isLast,
  endQuiz,
  postAnswer,
  progress,
  qtotal,
  scrollRef,
}) => {
  const [answer, setAnswer] = useState<any>({a: false, c: false});
  const {correct_answer, category} = question;
  const [correct, setCorrect] = useState<boolean>(false);
  const [wrong, setWrong] = useState<boolean>(false);
  const [next, setNext] = useState<boolean>(false);

  const answerData = useCallback(
    (correct: boolean, answer: any) => {
      const data = {
        id: question.id,
        correct: correct,
        answer: answer.a,
        category: answer.c,
      };

      console.log(data);
      return data;
    },
    [question],
  );

  useEffect(() => {
    if (answer.a && answer.a === correct_answer) {
      postAnswer(answerData(true, answer));
      setCorrect(true);
      setWrong(false);
      setNext(true);
    } else if (answer.a && answer.a !== correct_answer) {
      postAnswer(answerData(false, answer));
      setCorrect(false);
      setWrong(true);
      setNext(true);
    }
  }, [answer, correct_answer, answerData, postAnswer]);

  const scrollToBottom = () => {
    scrollRef.current?.scrollTo({y: 1000});
  };

  const answerColor = (id: number) => {
    if (answer.a && id === correct_answer) {
      return {backgroundColor: '#9ACA3C'};
    } else if (answer.a === id && id !== correct_answer) {
      return {backgroundColor: '#E63C38'};
    } else {
      return {backgroundColor: 'transparent'};
    }
  };

  return (
    <View style={styles.question_container} id={question.id.toString()}>
      <View>
        {isLast && <Head style={styles.finalq}>Final Question!</Head>}
        <View style={styles.progress_container}>
          <View style={[styles.progress_line, {width: progress + '%'}]}>
            {progress > 50 && (
              <Text style={styles.progress_qs_white}>
                {questionNumber} of {qtotal}
              </Text>
            )}
            <Image style={styles.truck_icon} source={images.truck} />
          </View>
          {progress <= 50 && (
            <Text style={styles.progress_qs_black}>
              {questionNumber} of {qtotal}
            </Text>
          )}
        </View>
      </View>

      <Para style={styles.question_text}>{question.question}</Para>

      {question.image && (
        <View style={styles.q_photo}>
          <Image
            style={styles.q_photo_img}
            source={{uri: question.image}}
            resizeMode="contain"
          />
        </View>
      )}

      <View style={styles.answerText}>
        {correct && (
          <View style={styles.result}>
            <Image style={styles.result_image} source={images.answer_right} />
            <Head>Correct!</Head>
          </View>
        )}
        {wrong && (
          <View style={styles.result}>
            <Image style={styles.result_image} source={images.answer_wrong} />
            <Head>Incorrect</Head>
          </View>
        )}
        {next && <Para style={styles.tip}>{question.tip}</Para>}
      </View>
      <View>
        {question.answer_1.length > 0 && (
          <TouchableOpacity
            disabled={answer.a}
            style={[styles.answerButton, answerColor(1)]}
            onPress={() => setAnswer({a: 1, c: category})}>
            <Text style={styles.answer_circle}>a</Text>
            <Head style={styles.answer_text}>{question.answer_1}</Head>
          </TouchableOpacity>
        )}

        {question.answer_2.length > 0 && (
          <TouchableOpacity
            disabled={answer.a}
            style={[styles.answerButton, answerColor(2)]}
            onPress={() => setAnswer({a: 2, c: category})}>
            <Text style={styles.answer_circle}>b</Text>
            <Head style={styles.answer_text}>{question.answer_2}</Head>
          </TouchableOpacity>
        )}

        {question.answer_3.length > 0 && (
          <TouchableOpacity
            disabled={answer.a}
            style={[styles.answerButton, answerColor(3)]}
            onPress={() => setAnswer({a: 3, c: category})}>
            <Text style={styles.answer_circle}>c</Text>
            <Head style={styles.answer_text}>{question.answer_3}</Head>
          </TouchableOpacity>
        )}

        {question.answer_4.length > 0 && (
          <TouchableOpacity
            disabled={answer.a}
            style={[styles.answerButton, answerColor(4)]}
            onPress={() => setAnswer({a: 4, c: category})}>
            <Text style={styles.answer_circle}>d</Text>
            <Head style={styles.answer_text}>{question.answer_4}</Head>
          </TouchableOpacity>
        )}
        <Br />
      </View>

      {!isLast && answer.a && (
        <TouchableOpacity onPress={nextQuestion}>
          <View onLayout={scrollToBottom} style={[styles.quiz_button]}>
            <Text style={styles.quiz_button_text}>Next &gt;</Text>
          </View>
        </TouchableOpacity>
      )}
      {isLast && answer.a && (
        <React.Fragment>
          <Head style={{textAlign: 'center', marginTop: 15}}>
            You have finished the quiz!
          </Head>
          <TouchableOpacity onPress={endQuiz}>
            <View onLayout={scrollToBottom} style={[styles.quiz_button]}>
              <Text style={styles.quiz_button_text}>See Your Score!</Text>
            </View>
          </TouchableOpacity>
        </React.Fragment>
      )}

      <Br />
    </View>
  );
};

export default Question;

const styles = StyleSheet.create({
  view: {flex: 1},
  question_container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  q_photo: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 240,
    marginBottom: 30,
  },
  q_photo_img: {
    height: '100%',
    width: '100%',
  },
  finalq: {
    textAlign: 'center',
    color: style.colours.hobsons_blue,
  },
  progress_container: {
    height: 20,
    margin: 10,
    borderRadius: 10,
    backgroundColor: '#EAE8E8',
  },
  progress_line: {
    height: 20,
    borderRadius: 10,
    backgroundColor: style.colours.purple_glass,
    position: 'relative',
  },
  truck_icon: {
    position: 'absolute',
    width: 36,
    height: 24,
    top: -2,
    right: -8,
  },
  progress_qs_white: {
    color: '#fff',
    position: 'absolute',
    left: 20,
  },
  progress_qs_black: {
    color: '#333',
    position: 'absolute',
    right: 20,
  },
  question_text: {
    fontSize: 24,
    lineHeight: 30,
    textAlign: 'center',
    marginVertical: 20,
  },
  result: {
    flexDirection: 'row',
    marginBottom: 5,
    alignItems: 'center',
  },
  result_image: {
    width: 40,
    height: 40,
    marginRight: 15,
  },
  tip: {
    marginBottom: 15,
  },
  answerButton: {
    flexShrink: 1,
    padding: 10,
    margin: 5,
    borderColor: style.colours.hobsons_blue,
    borderWidth: 2,
    borderRadius: 10,
    flexDirection: 'row',
  },
  answer_circle: {
    width: 25,
    height: 25,
    borderRadius: 13,
    // borderColor: "rgba(255,255,255,0.4)",
    // borderWidth: 2,
    color: '#fff',
    backgroundColor: style.colours.hobsons_blue,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    fontWeight: 'bold',
    lineHeight: 24,
    marginRight: 10,
    overflow: 'hidden',
  },
  answer_text: {
    flex: 1,
  },
  answerText: {
    textAlign: 'center',
  } as ViewStyle,
  quiz_button: {
    width: 240,
    backgroundColor: style.colours.hobsons_blue,
    borderRadius: 10,
    padding: 10,
    alignSelf: 'center',
    marginTop: 20,
  },
  quiz_button_text: {
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
    color: '#fff',
  },
});
