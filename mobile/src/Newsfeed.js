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
import NavBar from "./components/navigation/NavBar";
import NewsPost from "./components/news/NewsPost";
import { useData } from './utils/DataContext';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';

export default (props) => {
  const [page,setPage] = React.useState(1);
  const [lastRead,setLastRead] = React.useState(false);
  const [isLoading,setIsLoading] = React.useState(true);
  const [focus,setFocus] = React.useState(false);
  const [isEnd,setIsEnd] = React.useState(false);
  const [openPost, setOpenPost] = React.useState(false);
  const { navigation, route } = props;
  const {getNewsfeed,newsfeed,setNewsfeed,newsLast,setNewsLast,unread,setUnread} = useData();

  // event to run once on page focus
  useFocusEffect(React.useCallback(() => {
    setFocus(true);
    return () => setFocus(false);
  },[focus]))

  // trigger news refresh once on page focus
  React.useEffect(() => {
    if(focus){
      setLastRead(newsLast);
      console.log('run refresh',lastRead,newsLast);
      refreshNews();
    }
  }, [focus]);


  const refreshNews = async () => {
    setIsLoading(true);
    setPage(1);
    setOpenPost(false);
    await getNewsfeed(1).then((response)=>{
      setNewsfeed(response);
      let nfLast = response[0].id;
      setNewsLast(nfLast);
      setIsEnd(response.length < 10)
      setIsLoading(false);
      return AsyncStorage.setItem('newsLast',''+nfLast);
    }).then((res)=>{
      setUnread(false);
    })
  }



  const openNews = (id) => {
    setOpenPost(id);
  }
  
  const loadMoreNews = () => {
    setPage(page + 1);
  };

  const reset = () => {
    setNewsfeed([]);
    setPage(1);
    setOpenPost(false);
  }

  React.useEffect(() => {
    if(page != 1) {
      setIsLoading(true);
      getNewsfeed(page)
      .then(response => {
        setNewsfeed([...newsfeed,...response]);
        setIsEnd(response.length < 10)
        setIsLoading(false);
      })
      .catch(error => console.log(error));
    }
  }, [page]);


  React.useEffect(() => {
    console.log('lr ',lastRead)
  }, [lastRead]);

  return (
    <SafeAreaView style={styles.view}>
      <View style={styles.newsfeed}>
        <NavBar navigation={navigation}/>
        <ScrollView style={styles.newsfeed_scroll} contentContainerStyle={styles.newsfeed_scroll_content}>
          <Text style={styles.news_title}>News</Text>
          {newsfeed.map((c, index) => (
            c.inZone &&
              <NewsPost isNew={c.id > lastRead} isOpen={openPost == c.id} open={openNews} key={c.id} post={c}/>
            
          ))}

          { isLoading && <ActivityIndicator animating={true} size='large' color='#333333' /> }

          {!isEnd && !isLoading && (
            <TouchableOpacity style={styles.button} onPress={loadMoreNews}><Text style={styles.button_text}>Older Posts</Text></TouchableOpacity>
          )}
          {isEnd && !isLoading && (
            <React.Fragment>
              <Br/>
              <Text style={styles.button_text}>No more news to load</Text>
              <Br/>
              <Br/>
            </React.Fragment>
          )}
            
          { /*
          <TouchableOpacity style={styles.button} onPress={refreshNews}><Text style={styles.button_text}>Reset News</Text></TouchableOpacity>
        */}

        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  view: { flex: 1 },
  newsfeed: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff',
  },
  newsfeed_scroll: {
    flex: 1,
    paddingHorizontal: 20
  },
  news_title:{
    fontSize: 24,
    marginBottom: 20,
    marginTop: 10
  },
  newsfeed_scroll_content: {
    flexDirection: 'column'
  },
  button:{
    padding: 10,
    margin: 40,
    borderWidth: 1,
    borderColor: "#1352A5"
  },
  button_text:{
    fontSize: 16,
    textAlign: 'center',
    color: "#1352A5",
    fontWeight: "bold"
  },
  end_text: {
    fontSize: 16,
    color: "#1352A5",
    fontWeight: "bold"
  }
});
