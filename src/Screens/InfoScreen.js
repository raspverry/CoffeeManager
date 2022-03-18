import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

const InfoScreen = ({navigation, route}) => {

    return (
        <View style={styles.container}>
            <Text style={styles.headText}>{route.params.id.id}</Text>
            <Text style={styles.text}>CoffeeBean: {route.params.id.coffeeBean}</Text>
            <Text style={styles.text}>Description: {route.params.id.description}</Text>
        </View>
    )
}

export default InfoScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text:{
        fontSize: 20,
    },
    headText: {
        fontSize: 24,
        fontWeight: 'bold',
    },

})
