import { setDoc,getDoc, doc, deleteDoc } from 'firebase/firestore';
import { db, storage } from '../../firebase'
import {getAuth} from 'firebase/auth'
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage'
import * as ImagePicker from 'expo-image-picker';
import { updateProfile } from 'firebase/auth';
import { Alert } from 'react-native';
import * as ImageManipulator from 'expo-image-manipulator';


const pickImage = async (setImage) => {
    const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4,3],
        quality: 1,
    });

    if(!result.cancelled){
        setImage(result.uri);
    }
};


async function uploadUserPhoto(email, name, storeKey, uri){

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
    const fileRef = ref(storage, `User/${email}`);
    const uploadTask = uploadBytesResumable(fileRef, blob);
    uploadTask.on('state_changed', null,
        (error) => {
            alert(error);
        },
        () => {
            getDownloadURL(uploadTask.snapshot.ref)
            .then((URL) => {
                setDoc(doc(db, 'users', email.toLocaleLowerCase()), {name: name, storeKey: storeKey, postImage: URL});
                const auth = getAuth();
                const user = auth.currentUser;
                updateProfile(user, {displayName: name, photoURL: URL})
                .then(() => {
                    //console.log('registered')
                })
                //setDoc(doc(db, 'users', email.toLocaleLowerCase()), {postImage: URL}, {merge: true});

            });
            blob.close();
        }
    )
    // We're done with the blob, close and release it
    
    //return await getDownloadURL(fileRef);
    
}


const DeleteFiles = async (name, storeKey) => {
    const docRef = doc(db, 'Store', storeKey, 'coffeeDB', name);
    const coffee = await getDoc(docRef);
    await deleteDoc(docRef);
    const desertRef = ref(storage, `files/${name}`);
    deleteObject(desertRef).then(() => {
        Alert.alert(
            'Successful!',
            'Coffee Deleted.',[{
                text: 'OK',
                onPress: () => {}
            }]
        )
    }).catch((error) => {
        console.log(error)
    });
        
}

export {
    
    pickImage,
    uploadUserPhoto,
    DeleteFiles
}