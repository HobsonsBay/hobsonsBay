import React, {useCallback, useState, useRef, useEffect} from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
  Dimensions,
  StyleProp,
  ViewStyle,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Tip from './Tip';

interface ICarousel {
  slideList: any[];
  colours: string[];
}

const Carousel: React.FC<ICarousel> = ({slideList, colours}) => {
  const {width: windowWidth} = Dimensions.get('window');
  const [index, setIndex] = useState(0);
  const [heightArr, setHeightArr] = useState<Array<number>>([]);
  const [height, setHeight] = useState<number | false>(false);
  const [heightsLoaded, setHeightsLoaded] = useState(false);
  const [isStart, setIsStart] = useState(false);
  const [isEnd, setIsEnd] = useState(false);

  const indexRef = useRef(index);
  const carousel = useRef<FlatList>(null);

  indexRef.current = index;

  const onScroll = useCallback((event: any) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = event.nativeEvent.contentOffset.x / slideSize;
    const roundIndex = Math.round(index);

    const distance = Math.abs(roundIndex - index);

    // Prevent one pixel triggering setIndex in the middle
    // of the transition. With this we have to scroll a bit
    // more to trigger the index change.
    const isNoMansLand = 0.4 < distance;

    if (roundIndex !== indexRef.current && !isNoMansLand) {
      setIndex(roundIndex);
      //console.log('onscroll height',event,heightArr[roundIndex]+40)
    }
  }, []);

  // Load initial height
  useEffect(() => {
    //console.log('heights  loaded',heightArr)
    heightsLoaded && setHeight(heightArr[0] + 40);
  }, [heightsLoaded, heightArr]);

  useEffect(() => {
    //console.log('heightArr changed',heightArr,heightsLoaded)
  }, [heightArr]);

  useEffect(() => {
    setHeight(heightArr[index] + 40);
    slideList.length - 1 !== index ? setIsEnd(false) : setIsEnd(true);
    index !== 0 ? setIsStart(false) : setIsStart(true);
    //console.log('heightset',index,heightArr[index],heightArr)
  }, [index, slideList, heightArr]);

  const findDimensions = useCallback(
    (index: number, layout: any) => {
      //console.log('dim set',heightArr[index],layout.height)
      if (heightArr[index] == undefined || layout.height > heightArr[index]) {
        const {height} = layout;
        let heights = [...heightArr];
        heights[index] = height;
        setHeightArr(heights);
        //console.log('heightOut',heights)
        if (heights[0] != undefined) setHeightsLoaded(true);
      }
    },
    [heightArr],
  );

  const tip = (d: any) => {
    let {item, index} = d;

    //console.log('idkey', item, index)
    return (
      <View key={item.id}>
        <Tip
          width={windowWidth - 40}
          index={index}
          findDimensions={findDimensions}
          category={item.category}
          tip={item}
          colour={colours[item.category]}
        />
      </View>
    );
  };

  const nextButton = useCallback(() => {
    !isEnd && carousel.current?.scrollToIndex({index: index + 1});
  }, [index, isEnd]);

  const prevButton = useCallback(() => {
    !isStart && carousel.current?.scrollToIndex({index: index - 1});
  }, [index, isStart]);

  const ViewStyles = {
    container: {
      flex: 1,
      height: height ? height : 'auto',
    },
  } as const;

  return (
    <View style={ViewStyles.container as StyleProp<ViewStyle>}>
      <FlatList
        ref={carousel}
        data={slideList}
        style={{flex: 1}}
        keyExtractor={(item) => {
          return item.id;
        }}
        renderItem={(d) => tip(d)}
        pagingEnabled
        horizontal
        showsHorizontalScrollIndicator={true}
        onScroll={onScroll}
        removeClippedSubviews
      />
      <TouchableOpacity
        style={[styles.page, styles.next, isEnd && {opacity: 0.2}]}
        onPress={nextButton}>
        <Icon name="angle-right" size={32} color="#212121" />
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.page, styles.prev, isStart && {opacity: 0.2}]}
        onPress={prevButton}>
        <Icon name="angle-left" size={32} color="#212121" />
      </TouchableOpacity>
    </View>
  );
};

export default Carousel;

const styles = StyleSheet.create({
  view: {flex: 1},
  about: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff',
  },
  about_scroll: {
    flex: 1,
  },
  flexContainer: {
    flex: 1,
  },
  page: {
    width: 20,
    position: 'absolute',
    top: 0,
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  prev: {
    left: 0,
    padding: 4,
    alignItems: 'flex-start',
  },
  next: {
    right: 0,
    padding: 4,
    alignItems: 'flex-end',
  },
});
