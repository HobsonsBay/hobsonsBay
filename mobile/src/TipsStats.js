import Icon from 'react-native-vector-icons/FontAwesome';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import React, {
  useCallback
} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  ScrollView,
  Linking,
  useWindowDimensions
} from 'react-native';
import images from './utils/images';
import { openUrl } from './utils';
import { style } from "./utils/styles";
import { ListItem, Br, Head, Para, LinkButton, LinkTile } from "./utils/Typography";
import NavBar from "./components/navigation/NavBar";
import Carousel from "./components/tipsstats/Carousel";
import Stat from "./components/tipsstats/Stat";
import union from 'lodash/union';
import getTips from './api/getTips';
import SurveyMonkey from 'react-native-survey-monkey';

export default (props) => {
  const { navigation, route } = props;
  const [tips, setTips] = React.useState(null); 
  const [stats, setStats] = React.useState([]); 
  const [tipsData, setTipsData] = React.useState([]); 
  const [categories, setCategories] = React.useState([]); 
  const [colours, setColours] = React.useState([]); 
  const [key, setKey] = React.useState(0);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);
  const [filterCategories, setFilterCategories] = React.useState([]);

  const surveyMonkeyRef = React.createRef();
  const handleSurveyClick = () => surveyMonkeyRef.current.showSurveyMonkey('7GYZD8K');

  // load data on init
  React.useEffect(()=>{
    loading && init();
  },[loading])

  // refresh carousel when new data is loaded 
  React.useEffect(()=>{
    setKey(key+1)
  },[tips])

  // filter by categories
  React.useEffect(()=>{
    //console.log(filterCategories);
    if(filterCategories.length != 0){
      setTips(filterTips(shuffle(tipsData),filterCategories))
    }else{
      setTips(filterTips(shuffle(tipsData),categories))
    }
  },[filterCategories])

  const init = () => {
    setLoading(true);
    getTips().then((tsData)=>{
      let cats = tsData.categories.map((c) => c.name);
      let cols = {};
      tsData.categories.forEach((c) => {cols[c.name] = c.colour});
      setColours(cols)
      setCategories(cats)
      setStats(tsData.stats);
      setTipsData(tsData.tips);
      setTips(shuffle(tsData.tips))
      setLoading(false);
    }).catch((er)=>{
      setError(true)
    })
  }

  const filterCats = (category) => {
    let cats = [];
    if(!filterCategories.includes(category)){
      cats = union(filterCategories,[category]);
    }else {
      cats = filterCategories.filter((c)=>{
        return c != category;
      })
    }
    setFilterCategories(cats);
  }

  const filterTips = (tips,category) =>{
    return tips.filter((tip)=>category.includes(tip.category))
  }

  const shuffle = (array) => {
    return array.map((a) => ({sort: Math.random(), value: a}))
    .sort((a, b) => a.sort - b.sort)
    .map((a) => a.value)
  }

  const catColour = (category) => {
    return colours[category];
  }

  return (
    <SafeAreaView style={styles.view}>
      <View style={styles.about}>
        <NavBar navigation={navigation} route={route}/>
        <ScrollView style={styles.about_scroll} contentContainerStyle={styles.about_scroll_content}>

          <Image style={styles.r20_image} source={images.recyclingLogoStretch}/>
          <View style={styles.stats_container}>
            <Head style={styles.heading}>What Difference are we Making?</Head>
            {error && (<Text style={styles.error}>Error fetching data.</Text>)}
            { loading && <ActivityIndicator animating={true} size='large' color='#333333' /> }
            {stats.map((stat,index)=>{ return <Stat key={index} stat={stat}/> })}
          </View>
          <View style={styles.tips_container}>
            <Head style={styles.heading}>How can I make more of a difference?</Head>
          </View>
            {error && (<Text style={styles.error}>Error fetching data.</Text>)}
            { loading && <ActivityIndicator animating={true} size='large' color='#333333' /> }
            {tips &&(
                <Carousel key={key} slideList={tips} colours={colours}/>
            )}
          <View style={styles.tips_container}>
            <View style={styles.categories}>
              <View style={styles.filter_text}>
                <Text style={[styles.filter_text_text,{fontWeight:"bold"}]}>Filter By</Text>
                <TouchableOpacity style={styles.clear_button} onPress={()=>setFilterCategories([])}>
                  <Text style={[styles.filter_text_text,{textDecorationLine: "underline"}]}>Clear</Text>
                </TouchableOpacity>
              </View>
            {categories.map((category,index)=>{
              let selected = filterCategories.includes(category);
              return(
                <TouchableOpacity style={[styles.category_filter,{borderColor:catColour(category)}, selected && {backgroundColor: catColour(category)}]} key={index} onPress={()=>filterCats(category)}>
                  <Text style={[styles.category_filter_text,selected && styles.category_filter_text_selected]} >{category}</Text>
                </TouchableOpacity> 
              )
            })}
            </View>
            <Head style={{textAlign:'center'}}>Got a tip to share with the community?</Head>
            <Para style={{textAlign:'center'}}>Let us know how you become more waste responsible by using the form below!</Para>
            <View style={styles.submit_links}>
              <TouchableOpacity onPress={handleSurveyClick} style={styles.submit_link_button}>
                <Text style={styles.submit_link_label}>Submit a Tip</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
      <SurveyMonkey ref={ surveyMonkeyRef } />
    </SafeAreaView>
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
  r20_image: {
    width:172,
    height:47,
    alignSelf: "center",
    marginBottom: 20
  },
  error:{
    textAlign: 'center',
    marginTop: 20
  },
  categories:{
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20
  },
  filter_text:{
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8
  },
  filter_text_text:{
    fontSize: 16
  },
  category_filter: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
    borderColor: "#1352A5",
    borderWidth: 2,
    margin: 5
  },
  category_filter_selected: {
    backgroundColor: "#1352A5",
  },
  category_filter_text: {
    color: "#1352A5"
  },
  category_filter_text_selected: {
    color: "#1352A5"
  },
  heading:{
    color: "#1352A5",
    fontSize: 22,
    textAlign: 'center',
    marginBottom: 20
  },
  submit_links: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 20
  },
  submit_link_button: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    backgroundColor: '#1352A5'
  },
  submit_link_label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff'
  },
  stats_container:{
    marginHorizontal: 20,
    marginBottom: 30
  },
  tips_container:{
    marginHorizontal: 20,
  },
});
