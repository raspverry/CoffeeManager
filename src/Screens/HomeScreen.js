import React from 'react'
import { StyleSheet, Text, View, Image } from 'react-native'

const HomeScreen = ({route, navigation}) => {
    return (
        <View style={styles.container}>
            <Image source={require('../assets/logo.png')} style={styles.image} />
            <Text>Welcome!</Text>
        </View>
    )
}

export default HomeScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        tintColor: '#661a34',
        resizeMode: 'contain',
        paddingBottom: 300
    },
})
