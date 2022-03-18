import React, { useEffect, useRef, useState } from "react";
import { Alert} from "react-native";
import * as FileSystem from "expo-file-system";


async function findImageInCache(uri) {
  try {
    let info = await FileSystem.getInfoAsync(uri);
    return { ...info, err: false };
  } catch (error) {
    return {
      exists: false,
      err: true,
      msg: error,
    };
  }
}
async function cacheImage(uri, cacheUri, callback) {
  try {
    const downloadImage = FileSystem.createDownloadResumable(
      uri,
      cacheUri,
      {},
      callback
    );
    const downloaded = await downloadImage.downloadAsync();
    return {
      cached: true,
      err: false,
      path: downloaded.uri,
    };
  } catch (error) {
    return {
      cached: false,
      err: true,
      msg: error,
    };
  }
}
const CustomFastImage = (uri, cacheKey) => {
    
  const isMounted = useRef(true);
  const [imgUri, setUri] = useState("");
  useEffect(() => {
    async function loadImg() {
      let imgXt = 'jpeg'
      if (!imgXt || !imgXt.length) {
        Alert.alert(`Couldn't load Image!`);
        return;
      }
      const cacheFileUri = `${FileSystem.cacheDirectory}${cacheKey}.${imgXt}`;
      let imgXistsInCache = await findImageInCache(cacheFileUri);
      if (imgXistsInCache.exists) {
        //console.log("cached!");
        setUri(cacheFileUri);
      } else {
        let cached = await cacheImage(uri, cacheFileUri, () => {});
        if (cached.cached) {
          //console.log("cached NEw!");
          setUri(cached.path);
        } else {
          Alert.alert(`Couldn't load Image!`);
        }
      }
    }
    loadImg();
    return () => (isMounted.current = false);
  }, []);
    if(!imgUri){
        return {uri: '../assets/logo.png'}
  }
    else{
        return {uri: imgUri}
  }
};

export default CustomFastImage;