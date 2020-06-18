import messaging  from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-community/async-storage';
import React, {
  Component, 
  useState,
  useEffect,
} from 'react';
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  TouchableHighlight,
  View
} from 'react-native';

export default (props) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const binReminder = messaging().onMessage(async remoteMessage => {
      let pushContent;
      //setMessage(JSON.stringify(remoteMessage));
      //console.log(remoteMessage);
      if (remoteMessage.notification){
        //console.log('android')
        pushContent = remoteMessage.notification;
      }else{
        //console.log('ios')
        pushContent = remoteMessage.data.notification;
      }
      setMessage(pushContent.title + "\n" +pushContent.body);
      setModalVisible(true);
    });

    return binReminder;
  }, []);


 return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        message={message}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>{message}</Text>

            <TouchableHighlight
              style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
              onPress={() => {
                setModalVisible(!modalVisible);
              }}
            >
              <Text style={styles.textStyle}>Hide Modal</Text>
            </TouchableHighlight>
          </View>
        </View>
      </Modal>
 ) 
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 5,
    padding: 10,
    elevation: 2
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  }
});