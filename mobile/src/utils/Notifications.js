import messaging  from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-community/async-storage';
import React, {
  useCallback,
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
  TouchableOpacity,
  View,
  SafeAreaView,
  UIManager,
  LayoutAnimation
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default (props) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [expandedFull, setExpandedFull] = useState(false);
  const [message, setMessage] = useState("");
  const [rawMessageData, setRawMessageData] = useState(null);
  const [messageData, setMessageData] = useState(null);
  const [bgColor, setBgColor] = useState("#F7CCC9");

  /*
  STRUCTURE:

  on load, read from async notification which will return null or object
  if not null, set rawMessageData with raw message

  on message recieve, set async notification with raw message
  set rawMessageData with raw message 

  then parse into:
    message (title,body)
    type (reminder,service)
  and store in message
  */
  // let slideState = {
  //   height: new Animated.Value(0)
  // };

  // const showNotificationBar = () => {
  //   Animated.timing(slideState.height, {
  //     toValue: 100,
  //     duration: 1000
  //   }).start();
  // }


  useEffect(() => {
    // Assume a message-notification contains a "type" property in the data payload of the screen to open

    messaging().onNotificationOpenedApp(remoteMessage => {
      // console.log(
      //   'Notification caused app to open from background state:',
      //   remoteMessage.notification,
      // );
      setRawMessageData(remoteMessage);
      setExpandedFull(true);

      //navigation.navigate(remoteMessage.data.type);
    });

    // Check whether an initial notification is available
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          // console.log(
          //   'Notification caused app to open from quit state:',
          //   remoteMessage.notification,
          // );
          setRawMessageData(remoteMessage);
          setExpandedFull(true);
        }
      });
  }, []);


  const showNotificationBar = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(true);
    setExpandedFull(false);
  }

  const showNotificationFull = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedFull(!expandedFull);
  }

  const getNotification = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('notification')
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch(e) {
      // read error
    }
    //console.log('Done.')
  }

  const setNotification = async (value) => {
    try {
      const jsonValue = JSON.stringify(value)
      await AsyncStorage.setItem('notification', jsonValue)
    } catch(e) {
      // save error
    }

    //console.log('Done.')
  }

  const removeNotification = async () => {
    try {
      await AsyncStorage.removeItem('notification')
    } catch(e) {
      // remove error
    }
    //console.log('Done.')
  }

  useEffect(() => {
    getNotification().then((response) => {
      //console.log("run get not")
      if(response != null){
        //console.log('not null')
        //console.log(response);
        setRawMessageData(response);
      }else{
        //console.log('null')
        setRawMessageData(null);
      }
    })
  }, []);

  const handleNotificationDelete = useCallback(() => {    
    setExpanded(false);
    setExpandedFull(false);
    setRawMessageData(null);
    let msg = removeNotification();
    msg.then((response) => {
      //console.log(response)
    },(error) => {
      //console.log(error)
    })
  },[messageData, expanded, expandedFull]);


  const handleNotificationOpen = useCallback(() => {
    return false
  },[messageData]);


  const handleMessage = (message) => {
      setMessage(message.title + "\n" +message.body);
  }

  const handleRawMessageData = (message) => {
    let pushContent;
    if (message.notification){
      //console.log('android')
      pushContent = message.notification;
    }else{
      //console.log('ios')
      pushContent = message.data.notification;
    }
    if (message.data.type){
      pushContent.type = message.data.type;
    }else{
      pushContent.type = null;
    }
    setMessageData({ 
      message: { title: pushContent.title, body: pushContent.body},
      type: pushContent.type
    });
    handleMessage(pushContent)

    //console.log('message data:')
    //console.log(messageData)
  }

  useEffect(() => {
    //console.log('raw message data effect:')
    //console.log(rawMessageData)
    if(rawMessageData){
      handleRawMessageData(rawMessageData);
      showNotificationBar();
    }else{
      setMessage("")
      setMessageData(null)
    }
  }, [rawMessageData]);

  // useEffect(() => {
  //   console.log(messageData)
  //   if(messageData){
  //     if (messageData.type === "sevice") setBgColor("#ffff00");
  //     if (messageData.type === "reminder") setBgColor("#ff0000");
  //   }
  // }, [messageData]);


  useEffect(() => {
    const binReminder = messaging().onMessage(async remoteMessage => {
      setExpandedFull(false);
      setExpanded(false);
      let pushContent;
      if (remoteMessage.notification){
        //console.log('android')
        pushContent = remoteMessage.notification;
      }else{
        //console.log('ios')
        pushContent = remoteMessage.data.notification;
      }
      setNotification(remoteMessage)
      setRawMessageData(remoteMessage);

      //setModalVisible(true);
    });

    return binReminder;
  }, []);


 return (
  <>
      { expanded &&
        <SafeAreaView>
          <View style={{...styles.notificationHolder, backgroundColor: bgColor }}>
            <TouchableOpacity onPress={showNotificationFull} style={styles.notificationMessage}>
              <Text style={styles.notificationTitle}>{messageData.message.title}</Text>
              { expandedFull &&
                <Text style={styles.notificationBody}>{messageData.message.body}</Text>
              }
              <View>
                <Icon style={{ alignSelf : 'center'}} name={ expandedFull ? 'caret-up' : 'caret-down' } size={18} color='#757575' />
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={{justifyContent: 'center'}} onPress={handleNotificationDelete}>
              { expandedFull &&
                <View style={styles.notificationClose}>
                  <Icon name='close' size={12} color='#ffffff' />
                </View>
              }
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      }
      
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
      
  </>
 ) 
};

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
  },
  notificationHolder : {
    paddingVertical: 5,
    paddingLeft: 10,
    paddingRight: 5,
    backgroundColor: "#F7CCC9",
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5
  },
  notificationTitle : {
    fontWeight: "bold"
  },
  notificationBody : {
    marginTop: 5
  },
  notificationMessage : {
    //alignSelf: "stretch"
    flexShrink: 1,
    flexGrow: 1
  },
  notificationClose :{
    backgroundColor: "#cc0000",
    width: 20,
    height: 20,
    margin: 5,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
    //alignSelf: "flex-end"
  }
});