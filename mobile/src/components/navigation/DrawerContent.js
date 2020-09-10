import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import {
	DrawerContentScrollView,
	DrawerItem
} from '@react-navigation/drawer';
import images from '../../utils/images';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useData } from '../../utils/DataContext';

export default function(props){
	const { onShare, unread, address } = useData();
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
						onPress={()=>{props.navigation.navigate('Bin Schedule', { screen: address ? 'Schedule' : 'Address' })}}
					/>
					<DrawerItem 
						style={styles.item}
						label={({ focused, color }) => {
		    				return (
		    					<View style={styles.newsfeed}>{unread && (
						    		<View width={10} height={10} style={styles.unreadDot}></View>
						    	)}
						    	<Text 
						    		style={styles.itemLabel}
						    	>News</Text>
						    	</View>
						    )
	  					}}
						labelStyle={styles.itemLabel}
						onPress={()=>{props.navigation.navigate('Newsfeed')}}
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
						label="Notifications"
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
						onPress={()=>{props.navigation.navigate('Contact')}}
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
						onPress={()=>{onShare()}}
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
	newsfeed:{
		position: 'relative',
	},
	menuWrap: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'space-around',
		paddingLeft: 20
	},
	unreadDot:{
	    position: 'absolute',
	    left: 40,
	    top: 4,
	    width: 10,
	    height: 10,
	    borderRadius: 5,
	    backgroundColor: "#f00"
	}
})