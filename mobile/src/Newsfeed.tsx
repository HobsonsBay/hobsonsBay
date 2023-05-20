import React, {useCallback, useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import {Br} from './utils/Typography';
import NavBar from './navigation/NavBar';
import NewsPost from './components/news/NewsPost';
import {useData} from './utils/DataContext';
import {useFocusEffect} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface INewsfeed {
  navigation: any;
  route: any;
}

const Newsfeed: React.FC<INewsfeed> = ({navigation, route}) => {
  const [page, setPage] = useState<number>(1);
  const [lastRead, setLastRead] = useState<number | boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [focus, setFocus] = useState<boolean>(false);
  const [isEnd, setIsEnd] = useState<boolean>(false);
  const [openPost, setOpenPost] = useState<number | boolean>(false);
  const {
    getNewsfeed,
    newsfeed,
    setNewsfeed,
    newsLast,
    setNewsLast,
    // unread,
    setUnread,
  } = useData();

  // event to run once on page focus
  useFocusEffect(
    useCallback(() => {
      setFocus(true);
      return () => setFocus(false);
    }, []),
  );

  // trigger news refresh once on page focus
  useEffect(() => {
    const refreshNews = async () => {
      setIsLoading(true);
      setPage(1);
      setOpenPost(false);
      await getNewsfeed(1)
        .then((response: any) => {
          setNewsfeed(response);
          let nfLast = response[0].id;
          setNewsLast(nfLast);
          setIsEnd(response.length < 10);
          setIsLoading(false);
          return AsyncStorage.setItem('newsLast', '' + nfLast);
        })
        .then(() => {
          setUnread(false);
        });
    };

    if (focus) {
      setLastRead(newsLast);
      refreshNews();
    }
  }, [
    focus,
    getNewsfeed,
    setNewsLast,
    setNewsfeed,
    setUnread,
    lastRead,
    newsLast,
  ]);

  const openNews = (postId: number | boolean) => {
    setOpenPost(postId);
  };

  const loadMoreNews = () => {
    setPage(page + 1);
  };

  // const reset = () => {
  //   setNewsfeed([]);
  //   setPage(1);
  //   setOpenPost(false);
  // };

  useEffect(() => {
    if (page !== 1) {
      setIsLoading(true);
      getNewsfeed(page)
        .then((response: any) => {
          setNewsfeed((prevNewsfeed: any) => [...prevNewsfeed, ...response]);
          setIsEnd(response.length < 10);
          setIsLoading(false);
        })
        .catch((error: any) => console.log(error));
    }
  }, [page, getNewsfeed, setNewsfeed]);

  return (
    <SafeAreaView style={styles.view}>
      <View style={styles.newsfeed}>
        <NavBar navigation={navigation} route={route} />
        <ScrollView
          style={styles.newsfeed_scroll}
          contentContainerStyle={styles.newsfeed_scroll_content}>
          <Text style={styles.news_title}>News</Text>
          {newsfeed && newsfeed
            .sort((a, b) => {
              return new Date(b.time).getTime() - new Date(a.time).getTime();
            })
            .map(
              (c: any) =>
                c.inZone && (
                  <NewsPost
                    isNew={c.id > lastRead}
                    isOpen={openPost == c.id}
                    open={openNews}
                    key={c.id}
                    post={c}
                  />
                ),
            )}

          {isLoading && (
            <ActivityIndicator animating={true} size="large" color="#333333" />
          )}

          {!isEnd && !isLoading && (
            <TouchableOpacity style={styles.button} onPress={loadMoreNews}>
              <Text style={styles.button_text}>Older Posts</Text>
            </TouchableOpacity>
          )}
          {isEnd && !isLoading && (
            <React.Fragment>
              <Br />
              <Text style={styles.button_text}>No more news to load</Text>
              <Br />
              <Br />
            </React.Fragment>
          )}

          {/*
          <TouchableOpacity style={styles.button} onPress={refreshNews}><Text style={styles.button_text}>Reset News</Text></TouchableOpacity>
        */}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default Newsfeed;

const styles = StyleSheet.create({
  view: {flex: 1},
  newsfeed: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff',
  },
  newsfeed_scroll: {
    flex: 1,
    paddingHorizontal: 20,
  },
  news_title: {
    fontSize: 24,
    marginBottom: 20,
    marginTop: 10,
  },
  newsfeed_scroll_content: {
    flexDirection: 'column',
  },
  button: {
    padding: 10,
    margin: 40,
    borderWidth: 1,
    borderColor: '#1352A5',
  },
  button_text: {
    fontSize: 16,
    textAlign: 'center',
    color: '#1352A5',
    fontWeight: 'bold',
  },
  end_text: {
    fontSize: 16,
    color: '#1352A5',
    fontWeight: 'bold',
  },
});
