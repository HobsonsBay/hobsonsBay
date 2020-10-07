import React, {
  useCallback,
  useState,
  useRef,
  useEffect
} from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Button
} from 'react-native';
import Tip from "./Tip"
import Icon from 'react-native-vector-icons/FontAwesome';

const { width: windowWidth, height: windowHeight } = Dimensions.get("window");


export default (props) => {
	const {slideList, colours} = props;
  const [index, setIndex] = useState(0);
  const [heightArr,setHeightArr] = useState([]);
  const [height,setHeight] = useState(false);
  const [heightsLoaded, setHeightsLoaded] = useState(false);
  const [isStart, setIsStart] = useState(false);
  const [isEnd, setIsEnd] = useState(false);

  const indexRef = useRef(index);
  const carousel = useRef(null);

  indexRef.current = index;

  const onScroll = useCallback((event) => {
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
    heightsLoaded && setHeight(heightArr[0]+40)
  }, [heightsLoaded]);

  useEffect(() => {
  	//console.log('heightArr changed',heightArr,heightsLoaded)
  }, [heightArr]);

  useEffect(() => {
    setHeight(heightArr[index]+40);
    (slideList.length-1 != index) ? setIsEnd(false) : setIsEnd(true);
    (index != 0) ? setIsStart(false) : setIsStart(true);
  	//console.log('heightset',index,heightArr[index],heightArr)
  }, [index]);

  const find_dimesions = useCallback((index,layout) => {
  	//console.log('dim set',heightArr[index],layout.height)
    if(heightArr[index] == undefined || layout.height > heightArr[index]) {
      const {height} = layout;
      let heights = [...heightArr];
      heights[index] = height;
      setHeightArr(heights);
  		//console.log('heightOut',heights)
      if(heights[0] != undefined) 
      	setHeightsLoaded(true);
    }
  },[heightsLoaded,heightArr])

  const nextButton = React.useCallback(() => {
  	!isEnd && carousel.current.scrollToIndex({ index: index + 1})
  },[index, isEnd])

  const prevButton = React.useCallback(() => {
  	!isStart && carousel.current.scrollToIndex({ index: index - 1})
  },[index, isStart])

  const tip = ({ item, index }) => {
  	//console.log(index, item.tip)
    return (
    	<View key={item.key}>
    		<Tip 
        	width={windowWidth-40} 
        	index={index} 
        	findDimensions={find_dimesions}
        	category={item.category}
        	tip={item}
        	colour={colours[item.category]}
        />
      </View>
  	)
  }

  // const layoutTest = (data, index) => {
  //   const length = heightArr[index];
  //   const offset = heightArr.slice(0,index).reduce((a, c) => a + c, 0)
  //   return {length, offset, index}
  // }
  // style={{flex:1,alignItems:'center',justifyContent:'center'}} 
  // <View style={[{flex:1},height && {height: height}]}>
  // <View style={{flex:1}}>

  return (
  	<View style={[{flex:1},height && {height: height}]}>
	    <FlatList
      	ref={carousel}
	      data={slideList}
	      style={{flex:1}}
  			keyExtractor={(item, index) => item.key}
	      renderItem={tip}
	      pagingEnabled
	      horizontal
	      showsHorizontalScrollIndicator={true}
	      onScroll={onScroll}
	      removeClippedSubviews
	    />
  		  <TouchableOpacity style={[styles.page,styles.next, isEnd && {opacity: 0.2 }]} onPress={nextButton}>
  		    <Icon name='angle-right' size={32} color='#212121' />
  		  </TouchableOpacity>

  		  <TouchableOpacity style={[styles.page,styles.prev, isStart && {opacity: 0.2 }]} onPress={prevButton}>
  		    <Icon name='angle-left' size={32} color='#212121' />
  		  </TouchableOpacity>
 	    </View>
  );
};

const styles = StyleSheet.create({
  view: { flex: 1 },
  about: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff'
  },
  about_scroll: {
    flex: 1
  },
  flexContainer:{
    flex: 1
  },
  page: {
  	width: 20,
  	position: "absolute",
  	top: 0,
  	height: "100%",
  	display: 'flex',
  	alignItems: 'center',
  	justifyContent: 'center'
  },
  prev: {
  	left: 0,
  	padding: 4,
  	alignItems: 'flex-start'
  },
  next: {
  	right: 0,
  	padding: 4,
  	alignItems: 'flex-end'
  }
});


