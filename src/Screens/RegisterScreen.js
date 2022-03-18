import React, { useLayoutEffect, useState } from 'react';
import { StyleSheet, View, Image, Button, Pressable, KeyboardAvoidingView, Keyboard, Alert } from 'react-native';
import { Input, Text} from 'react-native-elements';
import { auth } from '../../firebase'
import { createUserWithEmailAndPassword } from 'firebase/auth';
import {doc, setDoc} from 'firebase/firestore';
import {db} from '../../firebase'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { ScrollView } from 'react-native';
import { pickImage, uploadUserPhoto } from '../Components/DataBase';
import basicImage from '../assets/ona.png';


const RegisterScreen = ( {navigation} ) =>{
    const basicUri = Image.resolveAssetSource(basicImage).uri;
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [storeKey, setStoreKey] = useState('');
    const [image, setImage] = useState(basicUri);
    
    
    useLayoutEffect(() => {
        navigation.setOptions({
            headerBackTitle: 'Login',
        })
    }, [navigation]);

    

    const register = () => {
        if(name && email && password && storeKey){

            createUserWithEmailAndPassword(auth, email, password)
            .then((authUser) => {
                setDoc(doc(db, 'users', email.toLocaleLowerCase()), {name: name, storeKey: storeKey, postImage: image});
                uploadUserPhoto(email, name, storeKey, image)
                
            })
            .catch(error => alert(error.message));
        }
        else{
            Alert.alert(
                'Error!',
                'Please fill all information.',[{
                    text: 'OK',
                    onPress: () => {}
                }]
            )
        }
    };



    return(
        <KeyboardAvoidingView behavior='padding' style={{flex: 1}}>
            <TouchableWithoutFeedback onPress={()=> Keyboard.dismiss()} >
                <ScrollView>
                    <View style={styles.container}>
                        <Text h3 style={{marginTop: '10%'}}>
                            Create a New Account
                        </Text>
                        <View style={styles.inputContainer}>
                            <Input placeholder='Full Name' type='text' value={name} onChangeText={(text) => setName(text) }/>
                            <Input placeholder='Email' type='email' value={email} onChangeText={(text) => setEmail(text) }/>
                            <Input placeholder='Password' type='password' value={password} secureTextEntry onChangeText={(text) => setPassword(text) }/>
                            <Input placeholder='Store Key' type='storeKey' value={storeKey} onChangeText={(text) => setStoreKey(text) }/>
                        </View>
                        <View style={{alignItems: 'center', paddingBottom: 10}}>
                        {image && < Image source={{uri: image}} style={{width: 200, height: 200, justifyContent: 'center'}}/>}
                        </View>
                        <Button title='Select image' onPress={() => pickImage(setImage)}/>
                        <Pressable style={({ pressed }) => [{backgroundColor: pressed ? '#aaaaaa' : '#661a34'}, styles.button]} title="Register" onPress={register}>
                        <Text style={styles.buttonText}>Register</Text>
                        </Pressable>
                        <View style={{ height: 100}}/>
                    </View>
                </ScrollView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}

export default RegisterScreen;

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        width: '100%',
        height: '100%'
    },
    inputContainer: {
        width: '75%',
    },
    button: {
        marginTop: '2%',
        width: '80%',
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
    },
});