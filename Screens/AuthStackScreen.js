import React from 'react';

import {createStackNavigator} from '@react-navigation/stack';
import SigninScreen from './SigninScreen';
import SignupScreen from './SignupScreen';

const AuthStack = createStackNavigator();
const AuthStackScreen = ({navigation}) => (
  <AuthStack.Navigator headerMode="none">
    <AuthStack.Screen name="SigninScreen" component={SigninScreen} />
    <AuthStack.Screen name="SignupScreen" component={SignupScreen} />
  </AuthStack.Navigator>
);

export default AuthStackScreen;
