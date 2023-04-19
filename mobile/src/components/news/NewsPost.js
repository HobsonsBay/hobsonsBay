import React from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  TouchableOpacity,
  Linking
} from 'react-native';
import format from 'date-fns/format';
import images from '../../utils/images';
import { style } from "../../utils/styles";
import { ListItem, Br, Head, Para, LinkButton, LinkText } from "../../utils/Typography";

export default (props) => {
  const {post} = props;
  const [viewed,setViewed] = React.useState(false);
  const time = format(new Date(post.time),"d MMMM");
  const showHide = () => {
    setViewed(true);
    if(!props.isOpen){
      props.open(post.id);
    }else{
      props.open(false); 
    }
  };
  let type = "news_update";
  switch (post.type){
    case "R2.0 News":
      type = "news_update";
    break;
    case "Service Update":
      type = "news_announce";
    break;
    case "Service Alert":
      type = "news_alert";
    break;
  }

  return (
      <View style={styles.newspost}>
        <TouchableOpacity onPress={showHide}>
          <View style={styles.news_head}>
            <View style={styles.news_head_icon}><Image style={styles.icon} source={images[type]} /></View>
            <View style={styles.news_head_title}>
              <Text style={(viewed || !props.isNew) ? styles.heading_viewed : styles.heading }>{post.title}</Text>
              <Text style={styles.date}>{time}</Text>
            </View>
          </View>
        </TouchableOpacity>
        {props.isOpen &&
        <View style={styles.news_body}>
          <Para>{post.body}</Para>
          {post.link_url.length > 0 &&(
            <LinkText style={styles.link} onPress={()=>{Linking.openURL(post.link_url)}}>{post.link_text}</LinkText>
          )}
        </View>
      }
    </View>
  );
};

const styles = StyleSheet.create({
  view: { flex: 1 },
  newspost: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff',
    borderTopColor: "#aaa",
    borderTopWidth: 1
  },
  news_head:{
    backgroundColor: "#F8F8F8",
    flex: 1,
    flexDirection: "row",
    padding: 10,
    paddingBottom: 20
  },
  news_head_icon:{
    width: 40,
    paddingTop:3
  },
  icon: {
    width: 30,
    height: 30
  },
  news_head_title: {
    flex: 1
  },
  heading:{
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1352A5',
    paddingBottom: 5
  },
  heading_viewed:{
    fontSize: 18,
    color: '#1352A5',
    paddingBottom: 5
  },
  date:{
    color: '#1352A5',
    fontSize: 14
  },
  news_body:{
    padding: 10,
    paddingVertical: 20
  },
  link:{
    fontSize: 16,
    lineHeight: 24,
    marginTop: 5
  }
});
