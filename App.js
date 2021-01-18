// In App.js in a new project

import React, {useEffect} from 'react';
import {View, Text, ActivityIndicator} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {createDrawerNavigator} from '@react-navigation/drawer';

import {AuthContext} from './Components/context';

import AuthStackScreen from './Screens/AuthStackScreen';
import DashboardScreen from './Screens/DashboardScreen';
import WhoWillWin from './Screens/WhoWillWin';
import T20Screen from './Screens/T20';
import BatsmanODIScreen from './Screens/BatsmanScoreODI';
import BatsmanT20Screen from './Screens/BatsmanScoreT20';
import {DrawerContent} from './Screens/DrawerContent';
import Toast from 'react-native-simple-toast';
import {post} from './Request';
import Config from './Config';
import {createStackNavigator} from '@react-navigation/stack';
import LiveMatch from './Screens/LiveMatch';
const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();
function DashboardContent() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="DashboardScreen" component={DashboardScreen} />
      <Stack.Screen name="LiveMatch" component={LiveMatch} />
    </Stack.Navigator>
  );
}
function App() {
  const initialLoginState = {
    isLoading: true,
    email: null,
    userToken: null,
  };
  const loginReducer = (prevState, action) => {
    switch (action.type) {
      case 'RETRIEVE_TOKEN':
        return {
          ...prevState,
          userToken: action.token,
          isLoading: false,
        };
      case 'SIGNIN':
        return {
          ...prevState,
          email: action.id,
          userToken: action.token,
          isLoading: false,
        };
      case 'SIGNOUT':
        return {
          ...prevState,
          email: null,
          userToken: null,
          isLoading: false,
        };
      case 'REGISTER':
        return {
          ...prevState,
          email: action.id,
          isLoading: false,
        };
    }
  };
  const [loginState, dispatch] = React.useReducer(
    loginReducer,
    initialLoginState,
  );
  const authContext = React.useMemo(
    () => ({
      signIn: async (email, password) => {
        post(Config.URL.AUTHENTICATION.SIGN_IN, {
          email,
          password,
        })
          .then((res) => {
            console.log('response from app.js');
            console.log(res);
            let userToken = null;
            // let role = [];
            if (res) {
              console.log(res);
              try {
                userToken = res.accessToken;
                // role = res.roles;
                AsyncStorage.setItem('userToken', userToken);
                // AsyncStorage.setItem('role', role);
                dispatch({type: 'SIGNIN', id: email, token: userToken});
              } catch (e) {
                console.log(e);
              }
            }
          })
          .catch((err) => {
            console.log('error from app.js');
            console.log(err.data.message);
            Toast.show(err.data.message);
          });
      },
      signOut: async () => {
        try {
          await AsyncStorage.removeItem('userToken');
          // await AsyncStorage.removeItem('role');
        } catch (e) {
          console.log(e);
        }
        dispatch({type: 'SIGNOUT'});
      },
      register: (firstName, lastName, email, password) => {
        post(Config.URL.AUTHENTICATION.SIGN_UP, {
          firstName,
          lastName,
          email,
          password,
        })
          .then((res) => {
            console.log('response from app.js for register');
            console.log(res);
            if (res) {
              try {
                dispatch({type: 'REGISTER', id: email});
                Toast.show(res.message);
              } catch (e) {
                console.log(e);
              }
            }
          })
          .catch((err) => {
            console.log('error from app.js');
            console.log(err.data.message);
            Toast.show(err.data.message);
            // notifyMessage(err.data.message);
          });
      },
    }),
    [],
  );

  useEffect(() => {
    setTimeout(async () => {
      let userToken = null;
      try {
        userToken = await AsyncStorage.getItem('userToken');
      } catch (e) {
        console.log(e);
      }
      dispatch({type: 'RETRIEVE_TOKEN', token: userToken});
    }, 1000);
  }, []);

  if (loginState.isLoading) {
    return (
      // eslint-disable-next-line react-native/no-inline-styles
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        {loginState.userToken !== null ? (
          <>
            <Drawer.Navigator
              drawerContent={(props) => <DrawerContent {...props} />}>
              <Drawer.Screen
                name="DashboardContent"
                component={DashboardContent}
              />
              <Drawer.Screen name="WhoWillWin" component={WhoWillWin} />
              <Drawer.Screen name="T20Screen" component={T20Screen} />
              <Drawer.Screen
                name="BatsmanODIScreen"
                component={BatsmanODIScreen}
              />
              <Drawer.Screen
                name="BatsmanT20Screen"
                component={BatsmanT20Screen}
              />
              {/* <Drawer.Screen name="BookmarkScreen" component={BookmarkScreen} /> */}
            </Drawer.Navigator>
          </>
        ) : (
          <AuthStackScreen />
        )}
      </NavigationContainer>
    </AuthContext.Provider>
  );
}

export default App;
