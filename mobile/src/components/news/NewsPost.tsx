import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  TouchableOpacity,
  Linking,
  ImageSourcePropType,
} from 'react-native';
import format from 'date-fns/format';
import images from '../../utils/images';
import {Para, LinkText} from '../../utils/Typography';

interface INewsPost {
  post: any;
  isOpen: boolean;
  isNew: boolean;
  open: (postId: string | false) => void;
}

const NewsPost: React.FC<INewsPost> = ({post, isOpen, isNew, open}) => {
  const [viewed, setViewed] = useState(false);
  const time = format(new Date(post.time), 'd MMMM yy');

  const showHide = () => {
    setViewed(true);
    if (!isOpen) {
      open(post.id);
    } else {
      open(false);
    }
  };

  let type = 'news_update';
  switch (post.type) {
    case 'R2.0 News':
      type = 'news_update';
      break;
    case 'Service Update':
      type = 'news_announce';
      break;
    case 'Service Alert':
      type = 'news_alert';
      break;
  }

  return (
    <View style={styles.newspost}>
      <TouchableOpacity onPress={showHide}>
        <View style={styles.news_head}>
          <View style={styles.news_head_icon}>
            <Image
              style={styles.icon}
              source={images[type] as ImageSourcePropType}
            />
          </View>
          <View style={styles.news_head_title}>
            <Text
              style={viewed || !isNew ? styles.heading_viewed : styles.heading}>
              {post.title.replace(/<br \/?>/g, ' ')}
            </Text>
            <Text style={styles.date}>{time}</Text>
          </View>
        </View>
      </TouchableOpacity>
      {isOpen && (
        <View style={styles.news_body}>
          <Para>{post.body.replace(/<br \/?>/g, '\n')}</Para>
          {post.link_url?.length > 0 && (
            <LinkText
              style={styles.link}
              onPress={() => Linking.openURL(post.link_url)}>
              {post.link_text}
            </LinkText>
          )}
        </View>
      )}
    </View>
  );
};

export default NewsPost;

const styles = StyleSheet.create({
  view: {flex: 1},
  newspost: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff',
    borderTopColor: '#aaa',
    borderTopWidth: 1,
  },
  news_head: {
    backgroundColor: '#F8F8F8',
    flex: 1,
    flexDirection: 'row',
    padding: 10,
    paddingBottom: 20,
  },
  news_head_icon: {
    width: 40,
    paddingTop: 3,
  },
  icon: {
    width: 30,
    height: 30,
  },
  news_head_title: {
    flex: 1,
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1352A5',
    paddingBottom: 5,
  },
  heading_viewed: {
    fontSize: 18,
    color: '#1352A5',
    paddingBottom: 5,
  },
  date: {
    color: '#1352A5',
    fontSize: 14,
  },
  news_body: {
    padding: 10,
    paddingVertical: 20,
  },
  link: {
    fontSize: 16,
    lineHeight: 24,
    marginTop: 5,
  },
});
