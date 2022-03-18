import React, {useEffect, useState, useLayoutEffect} from 'react'
import { Alert, KeyboardAvoidingView, TouchableOpacity } from 'react-native'
import { StyleSheet, Text, View, Image, Pressable, Keyboard } from 'react-native'
import { collection, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase'
import { TextInput } from 'react-native';
import { AntDesign} from '@expo/vector-icons';
import { TouchableWithoutFeedback } from 'react-native';
import CustomFastImage from '../Components/ImageLoader';
import shorthash from 'shorthash';

const OrderScreen = ({navigation, route}) => {
    //console.log(route.params.id.id)
    const image = route.params.id.image;
    const [coffeeStock, setCoffeeStock] = useState()
    const [text, setText] = useState()
    useEffect(() => {
        
       const unsub = onSnapshot(doc(db, 'Store', route.params.storeKey, 'coffeeDB', route.params.id.id), (doc) => {
           setCoffeeStock(Number(doc.data().number))
       })
        return unsub;
    }, []);
    

    const OrderCoffee = async () => {
        
        const coll = collection(db, 'Store', route.params.storeKey, 'coffeeDB')
        if(Number(route.params.id.number) >= Number(text)){
            route.params.id.number = (Number(route.params.id.number) - Number(text))

            await updateDoc(doc(coll, route.params.id.id), {
             'number': Number(route.params.id.number)
            });

            Alert.alert(
                'Successful!',
                'Coffee Ordered',[{
                    text: 'OK',
                    onPress: () => {}
                }]
            )
        }
        else{
            Alert.alert(
                'Error!',
                'The Number is too big.',[{
                    text: 'OK',
                    onPress: () => {}
                }]
            )
        }
    }

    const RefillCoffee = async () => {
        
        const coll = collection(db, 'Store', route.params.storeKey, 'coffeeDB')
        if(0 < Number(text)){
            route.params.id.number = (Number(route.params.id.number) + Number(text))

            await updateDoc(doc(coll, route.params.id.id), {
             'number': Number(route.params.id.number)
            });

            Alert.alert(
                'Successful!',
                'Coffee Refilled',[{
                    text: 'OK',
                    onPress: () => {}
                }]
            )
        }
        else{
            Alert.alert(
                'Error!',
                'The Number is too big.',[{
                    text: 'OK',
                    onPress: () => {}
                }]
            )
        }
    }
       
    const QuestionIcon = 
        { headerRight: () => (
            <View style={{marginRight: 10}}>
                <TouchableOpacity onPress={Info} activeOpacity={0.5}>
                <AntDesign name='questioncircleo' size={24} color='white' />
                </TouchableOpacity>
            </View>
        )}

    useLayoutEffect(() => {
        const unsub = navigation.setOptions(QuestionIcon)
        return unsub
    }, [])

    const Info = () => {
        navigation.navigate('Info', {
            id: route.params.id,
        });
    }

    

    return (
        <KeyboardAvoidingView style={styles.container} behavior='padding'>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
                <Image source={CustomFastImage(image, shorthash.unique(image))}  style={styles.image} />
                <Text style={styles.title}>{route.params.id.id}</Text>
                <Text style={styles.number}>Stock: {coffeeStock}</Text>
                <TextInput style={styles.numInput} placeholder={'Enter number'} value={text} onChangeText={(text) => setText(text)} keyboardType={'numeric'} />
                <Pressable style={({ pressed }) => [{backgroundColor: pressed ? '#aaaaaa' : '#661a34'}, styles.button]} title="Order" onPress={OrderCoffee}>
                <Text style={styles.buttonText}>Order</Text>
                </Pressable>
                <Pressable style={({ pressed }) => [{backgroundColor: pressed ? '#aaaaaa' : '#661a34'}, styles.button]} title="Order" onPress={RefillCoffee}>
                <Text style={styles.buttonText}>Refill</Text>
                </Pressable>
            </View>
            </TouchableWithoutFeedback>
            
        </KeyboardAvoidingView>
    )
}

export default OrderScreen

const styles = StyleSheet.create({
    container:{
        flex: 1,
        //justifyContent: 'center',
        alignItems: 'center',
        marginTop: '5%',
        
    },
    image:{
        width: 200,
        height: 200,
        resizeMode: 'contain' ,
        marginBottom: 10
    },
    title:{
        fontSize: 24,
        fontWeight: 'bold',
        paddingBottom: 10
    },
    number: {
        fontSize: 20,
    },
    button: {
        width: 300,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '2%'
    },
    buttonText: {
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
    },
    numInput:{
        fontSize: 22,
        padding: 5
    }

})
