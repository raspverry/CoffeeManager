import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, LogBox } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeScreen from './src/Screens/HomeScreen';
import LoginScreen from './src/Screens/LoginScreen';
import RegisterScreen from './src/Screens/RegisterScreen';
import StockScreen from './src/Screens/StockScreen';
import SplashScreen from './src/Screens/SplashScreen';
import CustomDrawer from './src/Components/CustomDrawer'
import { EvilIcons} from '@expo/vector-icons';
import { auth } from './firebase';
import { signOut } from 'firebase/auth';
import InfoScreen from './src/Screens/InfoScreen';
import OrderScreen from './src/Screens/OrderScreen';
import AddScreen from './src/Screens/AddScreen';
import 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons'; 
import { Feather } from '@expo/vector-icons';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();


LogBox.ignoreLogs(['Remote debugger']);



const App = ({ navigation }) => {
  return (
    <NavigationContainer >
      <StatusBar style={'light'} />
      <Stack.Navigator screenOptions={{headerShown: true, headerStyle: {backgroundColor: '#661a34'}, headerTitleStyle: {color: 'white'}, headerTintColor: 'white',}} initialRouteName="Login">
        <Stack.Screen name="Spash" component={SplashScreen} options={{headerShown: false}} />
        <Stack.Screen name="Login" component={LoginScreen} options={{headerShown: false}} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Drawer" component={DrawerNavigation} options={{headerShown: false}} />
        <Stack.Screen name='Order' component={OrderScreen} />
        <Stack.Screen name='Info' component={InfoScreen} />
        <Stack.Screen name='Add' component={AddScreen}  />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function DrawerNavigation({route, navigation} ) {
  //console.log(route.params)

  const headerStyles = {
    headerStyle: {backgroundColor: '#661a34'},
    headerTitleStyle: {color: 'white'},
    headerTintColor: 'white',
    headerRight: () => (
      <View style={{marginRight: 10}}>
          <TouchableOpacity onPress={signOutUser} activeOpacity={0.5}>
              <EvilIcons name='close' size={24} color='white'  />
          </TouchableOpacity>
      </View>
    )
  };

  const signOutUser = () =>{
    if(auth){
      signOut(auth)
      .then(() => {
        navigation.replace('Login')
      })
      .catch((error) => {
        
      });
    }
  }
  return(
    <Drawer.Navigator initialRouteName="Home" drawerContent={(props) => <CustomDrawer {...props} />} screenOptions={headerStyles} > 
      <Drawer.Screen name="Home" component={HomeScreen} initialParams={route.params} options={
        ({ title: 'Home' },
            { drawerIcon: () => <Ionicons name="home-outline" size={24} color="gray" /> })} />
      <Drawer.Screen name="Stock" component={StockScreen} initialParams={route.params} options={
        ({ title: 'Home' },
            { drawerIcon: () => <Feather name="coffee" size={24} color="gray" /> })}/>
    </Drawer.Navigator>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;
