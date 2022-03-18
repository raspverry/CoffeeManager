import React, { useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase'
import CustomListItem from '../Components/CustomListItem'
import { SafeAreaView } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { SearchBar } from 'react-native-elements/dist/searchbar/SearchBar'
import { AntDesign} from '@expo/vector-icons';




const StockScreen = ({ navigation , route} ) => {
    const storeKey = route.params.storeKey;
    const [coffeeStock, setCoffeeStock] = useState([]);
    //Search Functions --------
   const [search, setSearch] = useState("")
   const [filter, setFilter] = useState([])


   const updateSearch = (search) => {
      if(search){
      const newData = coffeeStock.filter(function (item) {
          const itemData = item.id ? item.id.toUpperCase() : ''.toUpperCase();
          const textData = search.toUpperCase();
          return itemData.indexOf(textData) > -1;
       });
       setFilter(newData);
       }
       else{
           setFilter(coffeeStock);
       }
       setSearch(search);
   }
   //-------------------------


   useEffect(() => {
        const unsub = onSnapshot(collection(db, 'Store', storeKey, 'coffeeDB'), (snapshot) => {
            setCoffeeStock(snapshot.docs.map((doc) =>  ({
                id: doc.id,
                data: doc.data(),
                //number: doc.data(),
                //coffeeBean: doc.data()
            })));
        });
        onSnapshot(collection(db, 'Store', storeKey, 'coffeeDB'), (snapshot) => {
            setFilter(snapshot.docs.map((doc) =>  (
                {
                id: doc.id,
                data: doc.data(),
                //number: doc.data(),
                //coffeeBean: doc.data()

            }
            )));
        });
        return unsub;
    }, []);

    const Order = (id, number, coffeeBean, description) => {
        navigation.navigate('Order', {
            id, 
            //number,
            storeKey,
            //coffeeBean
            
        });
    };
   

    return (
        <SafeAreaView style={{flex: 1}}>
            <View>
                <SearchBar placeholder='Type Coffee'  onChangeText={updateSearch} value={search}/>
            </View>
            <ScrollView>
                {filter.map(({id, data: { number }, data: {coffeeBean}, data: {description}, data: {postImage}}) => (
                    
                    <CustomListItem key={id} id={id} number={number} coffeeBean={coffeeBean} description={description} image={postImage} storeKey={storeKey} Order={Order}  />
                    ))}
            </ScrollView>
            <View>

            <AntDesign onPress={() => navigation.navigate('Add', {storeKey:storeKey})} name='pluscircle' size={24} color='#661a34' size={40} style={{position: 'absolute', right: 10, bottom: 5}} />
            </View>
        </SafeAreaView>
    )
}

export default StockScreen

const styles = StyleSheet.create({})
