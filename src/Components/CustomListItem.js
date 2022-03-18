import React from 'react';
import { StyleSheet, Text, View, Alert } from 'react-native';
import { ListItem, Avatar } from 'react-native-elements';
import { auth } from '../../firebase';
import shorthash from 'shorthash';
import { Swipeable } from 'react-native-gesture-handler';
import { Pressable } from 'react-native';
import {DeleteFiles} from '../Components/DataBase';
import CustomFastImage from '../Components/ImageLoader';

const checker = (image) => {
    if(image){
        const source=CustomFastImage(image, shorthash.unique(image));
        return source;
    }
    else{
        const source = require('../assets/logo.png')
    }
}

const CustomListItem = ({id, number, data, coffeeBean, description, image, storeKey, Order}) => {
    const user = auth.currentUser;
    const name = user.displayName;
    
    const RightSwipe = (progress, dragX) => {
        return(
        <View style={{width:80, backgroundColor: 'red', alignItems: 'center', justifyContent: 'center', borderRadius:20}}>
            <Pressable onPress={() => MessageBox(id)} ><Text style={{color: 'white', fontWeight: '600'}}>Delete</Text></Pressable>
        </View>
        )
    }

    const MessageBox = (id) => {
        Alert.alert(
            'Delete',
            'Are you sure you want to delete?',
            [
                {
                    text: 'cancel',
                    onPress: () => {},
                    style: 'cancel'
                },
                {
                    text: 'OK',
                    onPress: () => DeleteFiles(id, storeKey)
                }
            ]
        )
    }



   return (
       
        <Swipeable useNativeAnimations overshootRight={false} renderRightActions={RightSwipe} onSwipeableRightOpen={() => MessageBox}  >
       <ListItem key={id} bottomDivider onPress={() => {Order({id, number, coffeeBean, description, image})}} >
            <Avatar rounded source={checker(image)} />
            <ListItem.Content >
                <ListItem.Title style={{ fontWeight: '800'}}>{id}</ListItem.Title>
                <ListItem.Subtitle numberOfLines={1} ellipsizeMode='tail'>
                    Stock: {number}
                </ListItem.Subtitle>
            </ListItem.Content>
            
        </ListItem>
       </Swipeable>
    )
}

//<CustomFastImage source={{uri: image}} cacheKey={shorthash.unique(image)} name={id} />
export default CustomListItem

const styles = StyleSheet.create({})
