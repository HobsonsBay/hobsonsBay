import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import trim from 'lodash/trim';
import React, {useCallback} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  ImageSourcePropType,
} from 'react-native';
import images from './utils/images';
import {
  getItemBinLabel,
  getBinImgNT,
  getItemBinColor,
  getItemTextColor,
  RUBBISH,
} from './utils';
import useItem, {ItemData} from './hooks/useItem';
import Paragraph from './components/item/Paragraph';

interface IITemScreen {
  navigation: any;
  route: any;
}

const ItemScreen: React.FC<IITemScreen> = ({navigation, route}) => {
  const param = get(route, 'params.item', {});
  const itemNumber = param['Item Number'] || 155;
  const [item = {} as ItemData] = useItem(itemNumber);
  const loading = !item.name;
  const handleButton = useCallback(() => navigation.goBack(), [navigation]);

  const itemCardStyle = [
    styles.item_card,
    {
      backgroundColor: getItemBinColor(item.bin_type),
      color: getItemTextColor(item.bin_type),
    },
  ];
  const itemCardLabelStyle = [
    styles.item_card_label,
    {color: getItemTextColor(item.bin_type)},
  ];

  return (
    <SafeAreaView style={styles.view}>
      <View style={styles.item}>
        <View style={styles.item_head}>
          <TouchableOpacity style={styles.item_button} onPress={handleButton}>
            <Text>
              <MaterialIcon name="arrow-back" size={32} color="#212121" />
            </Text>
            <Text style={styles.item_button_text}>
              Which bin does this go in?
            </Text>
          </TouchableOpacity>
          <Image
            style={styles.item_logo}
            source={images.hbccLogo as ImageSourcePropType}
          />
        </View>
        <View style={itemCardStyle}>
          <Text style={itemCardLabelStyle}>{item.name}</Text>
        </View>
        {item.bin_type === RUBBISH && <View style={styles.item_card_ribbon} />}

        <ScrollView
          style={styles.item_body}
          contentContainerStyle={[
            styles.item_body_content,
            loading ? {flex: 1} : {},
          ]}>
          {loading && <ActivityIndicator size="large" color="#f0b41c" />}
          {!loading && (
            <>
              <View style={styles.item_bin}>
                <Image
                  style={styles.item_bin_img}
                  source={
                    images[getBinImgNT(item.bin_type)] as ImageSourcePropType
                  }
                />
                <Text style={styles.item_bin_label}>
                  {getItemBinLabel(item.bin_type)}
                </Text>
              </View>
              {!isEmpty(item.url) && (
                <View style={styles.item_photo}>
                  <Image
                    style={styles.item_photo_img}
                    source={{uri: item.url}}
                    resizeMode="contain"
                  />
                </View>
              )}
              {!isEmpty(item.description) && (
                <Text style={styles.item_description}>
                  {trim(item.description.replace(/<br\s*\/?>/g, '\n'))}
                </Text>
              )}
              {!isEmpty(item.disposal_guidance) && (
                <View style={styles.item_section}>
                  <Text style={styles.item_section_head}>
                    Disposal Guidance
                  </Text>
                  <Paragraph
                    text={item.disposal_guidance.replace(/<br\s*\/?>/g, '\n')}
                  />
                </View>
              )}
              {!isEmpty(item.alternative_disposal) && (
                <View style={styles.item_section}>
                  <Text style={styles.item_section_head}>
                    Alternative Disposal
                  </Text>
                  <Paragraph
                    text={item.alternative_disposal.replace(
                      /<br\s*\/?>/g,
                      '\n',
                    )}
                  />
                </View>
              )}
              {!isEmpty(item.additional_info) && (
                <View style={styles.item_section}>
                  <Text style={styles.item_section_head}>Additional Info</Text>
                  <Paragraph
                    text={item.additional_info.replace(/<br\s*\/?>/g, '\n')}
                  />
                </View>
              )}
            </>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default ItemScreen;

const styles = StyleSheet.create({
  view: {flex: 1},
  item: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff',
  },
  item_head: {
    height: 64,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  item_button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 24,
  },
  item_button_text: {
    marginLeft: 12,
    fontSize: 16,
    color: '#212121',
    lineHeight: 20,
  },
  item_logo: {
    height: 32,
    width: 75,
    marginRight: 15,
  },
  item_card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  item_card_label: {
    fontSize: 24,
  },
  item_card_ribbon: {
    height: 12,
    backgroundColor: '#E63C38',
  },
  item_body: {
    flex: 1,
    paddingBottom: 10,
    paddingHorizontal: 20,
  },
  item_body_content: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  item_bin: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  item_bin_img: {
    width: 33,
    height: 38,
    marginRight: 15,
  },
  item_bin_label: {
    fontSize: 18,
    color: '#212121',
  },
  item_photo: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 180,
    marginBottom: 30,
  },
  item_photo_img: {
    height: '100%',
    width: '100%',
  },
  item_description: {
    marginBottom: 30,
    padding: 20,
    fontSize: 16,
    backgroundColor: '#F2EDED',
    borderRadius: 5,
    letterSpacing: 0.8,
  },
  item_section: {
    flexDirection: 'column',
    marginBottom: 30,
  },
  item_section_head: {
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
});
