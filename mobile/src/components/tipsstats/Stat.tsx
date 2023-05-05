import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  TouchableOpacity,
  ImageBackground,
  ViewStyle,
  StyleProp,
} from 'react-native';

import images from '../../utils/images';
import {style} from '../../utils/styles';
import {Head} from '../../utils/Typography';

interface IStat {
  stat: any;
}

const Stat: React.FC<IStat> = ({stat}) => {
  const [show, setShow] = useState(false);

  let bgColor: StyleProp<ViewStyle> = {
    backgroundColor: '#aaaaaa',
  };

  let indicator: any;

  switch (stat.type) {
    case 'Food & Garden':
      console.log('Food & Garden');
      bgColor.backgroundColor = style.colours.green_fogo;
      break;
    case 'Rubbish':
      console.log('Rubbish');
      bgColor.backgroundColor = style.colours.green_rubbish;
      break;
    case 'Mixed Recycling':
      console.log('Mixed Recycling');
      bgColor.backgroundColor = style.colours.yellow_recycle;
      break;
    case 'Glass':
      console.log('Glass');
      bgColor.backgroundColor = style.colours.purple_glass;
      break;
  }

  switch (stat.indicator) {
    case 'up':
      indicator = images.s_up; //<Icon name='arrow-up' size={32} color='#ffffff' />
      break;
    case 'down':
      indicator = images.s_down; //<Image source={indicator}/> <Icon name='arrow-down' size={32} color='#ffffff' />
      break;
    case 'neutral':
      indicator = images.s_neut; //<Image source={indicator}/> <Icon name='arrow-down' size={32} color='#ffffff' />
      break;
  }

  return (
    <TouchableOpacity onPress={() => setShow(!show)}>
      <View style={[styles.stats_block]}>
        {stat.type != 'Rubbish' && (
          <View style={[styles.stats_indicator, bgColor]}>
            <Image style={styles.icon} source={indicator} />
          </View>
        )}
        {stat.type == 'Rubbish' && (
          <ImageBackground
            source={images.rubbish_home}
            style={styles.stats_indicator}>
            <Image style={styles.icon} source={indicator} />
          </ImageBackground>
        )}
        <View style={styles.stats_info}>
          <Head style={styles.head}>{stat.type}</Head>
          <Text numberOfLines={show ? 100 : 2} style={styles.para}>
            {stat.stat}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default Stat;

const styles = StyleSheet.create({
  tip_container: {
    position: 'relative',
    margin: 20,
    padding: 10,
    backgroundColor: '#aff',
    borderRadius: 10,
  },
  stats_block: {
    flexDirection: 'row',
    flex: 1,
    paddingVertical: 10,
    borderBottomColor: '#aaa',
    borderBottomWidth: 1,
    //height: 100,
    overflow: 'hidden',
  },
  head: {
    marginBottom: 5,
  },
  stats_indicator: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 18,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  stats_info: {
    flex: 1,
    overflow: 'hidden',
  },
  icon: {
    width: 50,
    height: 50,
  },
  para: {
    fontSize: 16,
    lineHeight: 24,
  },
});
