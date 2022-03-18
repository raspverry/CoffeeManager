import {
    DrawerContentScrollView,
    DrawerItemList,
    DrawerItem,
} from '@react-navigation/drawer'
import React, { Component } from 'react';
import { StyleSheet, Image, ImageBackground, Text } from 'react-native'
import CustomFastImage from './ImageLoader';
import shorthash from 'shorthash';
import { StatusBar } from 'expo-status-bar';



const CustomDrawer = (props) => {
    //console.log(props.state.routes[0].params)
    const name = props.state.routes[0].params.userName;
    const storeKey = props.state.routes[0].params.storeKey;
    const profileImage = props.state.routes[0].params.image;
    return (
        <DrawerContentScrollView {...props}>
            <ImageBackground source={require('../assets/banner.png')} style={styles.Background}  >
            <Image source={CustomFastImage(profileImage, shorthash.unique(profileImage))}  style={styles.Image} />
            <Text style={styles.Text}>{name}</Text>
            <Text style={styles.SubText}>Store Number: {storeKey}</Text>
            </ImageBackground>

            <DrawerItemList {...props} />
        </DrawerContentScrollView>
    );
}
export default CustomDrawer

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    Background: {
        padding: 20,
        marginBottom: 20
    },
    Image: {
        height: 80, 
        width: 80, 
        borderRadius: 40, 
        marginBottom: 10
    },
    Text: {
        color: 'white',
        fontSize: 18,
        fontFamily: 'Arial',
        fontWeight: 'bold',
        marginBottom: 5
    },
    SubText:{
        color: 'white',
        fontSize: 14,
        fontFamily: 'Arial'
    }
})

