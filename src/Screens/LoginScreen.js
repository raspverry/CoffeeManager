import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, Button, Pressable, KeyboardAvoidingView } from 'react-native';
import { Input} from 'react-native-elements';
import { auth } from '../../firebase';
import { signInWithEmailAndPassword, onAuthStateChanged} from 'firebase/auth';
import { TouchableWithoutFeedback } from 'react-native';
import { Keyboard } from 'react-native';
import { getDoc, doc } from 'firebase/firestore';
import {db} from '../../firebase'

const LoginScreen = ( {navigation}) => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [storeKey, setStoreKey] = useState([]);
    const [userName, setName] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [image, setImage] = useState(null);
    
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (authUser) => {
            if(authUser){
                const UserInfo = async () => {
                    const docRef = await getDoc(doc(db, 'users', authUser.email));
                    setStoreKey(docRef.data().storeKey)
                    setName(docRef.data().name);
                    setImage(docRef.data().postImage);
                    navigation.replace('Drawer', {
                        storeKey: docRef.data().storeKey,
                        userName: docRef.data().name,
                        image: docRef.data().postImage,
                    });
                }
                return UserInfo();
            }
        });
        return unsubscribe;
    }, []);
    
    const signInUser =  () => {
        signInWithEmailAndPassword(auth, email, password)
            .then((re) => {
            })
            .catch(error => alert(error.message));
    }

    

    return(
    <KeyboardAvoidingView behavior='padding' style={styles.container}>
        <TouchableWithoutFeedback onPress={()=> Keyboard.dismiss()}>
            <View style={{justifyContent: 'center', alignItems: 'center', width: '100%'}}>
                <Text style={styles.text}>Life beigns after Coffee</Text>
                <Image style={styles.image} source={require('../assets/logo.png')}/>
                <View style={styles.input}>

                <Input color="white" placeholder="Email" type="Email" value={email} onChangeText={(text) => setEmail(text)}/>
                <Input placeholder="Password" secureTextEntry type="Password" value={password} onChangeText={(text) => setPassword(text)} onSubmitEditing={signInUser} />

                </View>
                <Pressable style={({ pressed }) => [{backgroundColor: pressed ? '#aaaaaa' : 'white'}, styles.button]} title="Login" onPress={signInUser}>
                    <Text >Login</Text>
                </Pressable>
                <Pressable style={({ pressed }) => [{backgroundColor: pressed ? '#aaaaaa' : 'white'}, styles.button]} title="Register" onPress={() => navigation.navigate('Register')}>
                    <Text>Register</Text>
                </Pressable>
                <View style={{ height: '1%'}}/>
            </View>
        </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
    )
    };

export default LoginScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#661a34',
        alignItems: 'center',
        justifyContent: 'center'
    },
    image:{
        marginTop: '10%',
        marginBottom: '7%'
    },
    input:{
        width: '75%'
    },
    text:{
        color: 'white',
        fontSize: 14,
        fontFamily: 'Cochin',
    },
    button :{
        marginTop: '2%',
        width: '80%',
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
});