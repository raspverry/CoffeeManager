import React, { useState } from 'react'
import { StyleSheet, View, KeyboardAvoidingView, Pressable, Image, Alert } from 'react-native'
import { collection, setDoc, doc } from 'firebase/firestore';
import { db, storage } from '../../firebase'
import { Button } from 'react-native';
import { Input, Text} from 'react-native-elements';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { ScrollView } from 'react-native';
import { pickImage } from '../Components/DataBase'
import basicImage from '../assets/coffee_icon.png';
import Spinner from 'react-native-loading-spinner-overlay';
import * as ImageManipulator from 'expo-image-manipulator';

const AddScreen = ({route, navigation}) => {
    //console.log(route.params.storeKey)
    const storeKey = route.params.storeKey;
    
    const [name, setName] = useState('');
    const [number, setNumber] = useState('');
    const [description, setDescription] = useState('');
    const [bean, setBean] = useState('');
    const basicUri = Image.resolveAssetSource(basicImage).uri;
    const [image, setImage] = useState(basicUri);


    async function uploadFiles(uri, name, storeKey){

        const file = await ImageManipulator.manipulateAsync(uri, [], { compress: 0.1 });
        const blob = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = function () {
                resolve(xhr.response);
            };
            xhr.onerror = function (e) {
                alert(e);
                reject(new TypeError("Network request failed"));
            };
            xhr.responseType = "blob";
            xhr.open("GET", file.uri, true);
            xhr.send(null);
        });

        const fileRef = ref(storage, `files/${name}`);
        const uploadTask = uploadBytesResumable(fileRef, blob);
        uploadTask.on('state_changed', (snapshot) => {
            const progress =  snapshot.bytesTransferred / snapshot.totalBytes;
            if(progress < 1){
                setLoading(true)
            }
        },
            (error) => {
                alert(error);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref)
                .then((URL) => {
                    setDoc(doc(db, 'Store', storeKey, 'coffeeDB', name), {postImage: URL}, {merge: true});
                    setLoading(false);
                    ReturnBox()
                });
                blob.close();
            }
        )
    }
    
//====================================================================================

    const ReturnBox = () =>{
        Alert.alert(
            'Successful!',
            'New Coffee Registered!',[{
                text: 'OK',
                onPress: () => navigation.goBack()
            }]
        )
    }

    const addCoffee = async (name, bean, number, description, image) => {
        if(name.length && bean.length && number >= 0 && description.length){
            if(image && name.length){
                //startLoading(true);
                uploadFiles(image, name, storeKey);
            }
            const coll = collection(db, 'Store', storeKey, 'coffeeDB');
            const docData = {
            coffeeBean: bean,
            number: Number(number),
            description: description,
            };
        await setDoc(doc(coll, name), docData, {merge: true})
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
    //finishLoading(false);
}

    const [loading, setLoading] = useState(false);
    
    

    return (
        <KeyboardAvoidingView behavior='padding' style={styles.container}>
            <ScrollView style={{flex: 1, width: '105%'}}>
            {loading ? <Spinner visible={loading} textContent={'Loading...'} /> : 
            <View style={styles.container}>

            <Text h3 style={{marginTop: '10%'}}>
                Add Coffee
            </Text>
            <View style={styles.inputContainer}>
                <Input placeholder='Coffee Name' type='text' value={name} onChangeText={(text) => setName(text) }/>
                <Input placeholder='Coffee Bean' type='text' value={bean} onChangeText={(text) => setBean(text) }/>
                <Input placeholder='Number' type='number' value={number} onChangeText={(text) => setNumber(text) } keyboardType={'numeric'} />
                <Input placeholder='Description' type='description' value={description} onChangeText={(text) => setDescription(text) }/>
                <View style={{alignItems: 'center', paddingBottom: 10}}>
                    {image && < Image source={{uri: image}} style={{width: 200, height: 200, justifyContent: 'center'}}/>}
                </View>
                <Button title='Select image' onPress={() => pickImage(setImage)}/>
            </View>
            <Pressable style={({ pressed }) => [{backgroundColor: pressed ? '#aaaaaa' : '#661a34'}, styles.button]} title="Register" onPress={() => {addCoffee(name, bean, number, description, image) }}>
            <Text style={styles.buttonText}>Register</Text>
            </Pressable>
            </View>
        }
            <View style={{ height: 100}}/>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}

export default AddScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
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
})
