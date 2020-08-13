import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import {
	DrawerContentScrollView,
	DrawerItem
} from '@react-navigation/drawer';
import images from '../../utils/images';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function(props){
	console.log(props);
	return(
		<React.Fragment>
			<View style={styles.logo}>
				<Image style={styles.logoImg} source={images.recyclingLogoWite} />
			</View>
			<View style={styles.menuWrap}>
				<View>
					<DrawerItem 
						style={styles.item}
						icon={({color,size}) =>(
							<Icon name="home" size={26} color='#ffffff' />
						)}
						label="Home"
						labelStyle={[styles.itemLabel,{marginLeft:0}]}
						onPress={()=>{props.navigation.navigate('Home')}}
					/>
					<DrawerItem 
						style={styles.item}
						label="Bin Schedule"
						labelStyle={styles.itemLabel}
						onPress={()=>{props.navigation.navigate('Bin Schedule')}}
					/>
					<DrawerItem 
						style={styles.item}
						label={({ focused, color }) => {
	    				return (
					    	<Text 
					    		numberOfLines={2} 
					    		style={styles.itemLabel}
					    	>Which bin does{"\n"}this go in?</Text>
					    )
  					}}
						labelStyle={styles.itemLabel}
						onPress={()=>{props.navigation.navigate('Which bin')}}
					/>
					<DrawerItem 
						style={styles.item}
						label="Reminder"
						labelStyle={styles.itemLabel}
						onPress={()=>{props.navigation.navigate('Collection Reminder')}}
					/>
				</View>
				<View>
					<DrawerItem
						style={styles.item}
						label="About"
						labelStyle={styles.itemLabel}
						onPress={()=>{props.navigation.navigate('About')}}
					/>
					<DrawerItem 
						style={styles.item}
						label="Contact"
						labelStyle={styles.itemLabel}
						onPress={()=>{props.navigation.navigate('')}}
					/>
					<DrawerItem 
						style={styles.item}
						label="Feedback"
						labelStyle={styles.itemLabel}
						onPress={()=>{props.navigation.navigate('Feedback')}}
					/>
					<DrawerItem 
						style={styles.item}
						label="Share"
						labelStyle={styles.itemLabel}
						onPress={()=>{props.navigation.navigate('')}}
					/>
				</View>
			</View>
			</React.Fragment>
	)
}


const styles = StyleSheet.create({
	logo: {
		paddingHorizontal:20,
		paddingTop:50,
		alignItems: 'center'
	},
	logoImg: {
		height: 164 / 3,
		width: 600 / 3
	},
	item: {
		marginVertical: 0,
		paddingVertical: 0
	},
	itemLabel: {
		 color: "#fff", 
		 fontSize: 14, 
		 fontWeight: 'bold',
		 marginLeft: 58,
		 marginRight: 0
	},
	menuWrap: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'space-around',
		paddingLeft: 20
	}
})