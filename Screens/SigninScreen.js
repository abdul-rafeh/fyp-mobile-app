import React, {Component, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Image,
  ImageBackground,
} from 'react-native';
import {AuthContext} from '../Components/context';
import {Button} from 'react-native-paper';

export function SigninScreen({navigation}) {
  // const [isLoading, setIsLoading] = React.useState(false);
  const [data, setData] = React.useState({
    email: '',
    password: '',
  });
  const {signIn} = React.useContext(AuthContext);

  const loginHandler = (email, password) => {
    signIn(email, password);
  };

  const textInputChange = (val) => {
    setData({
      ...data,
      email: val,
    });
  };
  const handlePasswordChange = (val) => {
    setData({
      ...data,
      password: val,
    });
  };
  const validateEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../assets/background.jpg')}
        style={{
          width: '100%',
          height: '100%',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Image source={require('../assets/logo.png')} style={styles.logo} />
        <View style={styles.inputView}>
          <TextInput
            style={styles.inputText}
            placeholder="Email"
            placeholderTextColor="#808080"
            onChangeText={(val) => textInputChange(val)}
          />
        </View>
        <View style={styles.inputView}>
          <TextInput
            style={styles.inputText}
            secureTextEntry
            placeholder="Password"
            placeholderTextColor="#808080"
            onChangeText={(val) => handlePasswordChange(val)}
          />
        </View>

        <TouchableOpacity
          style={styles.loginBtn}
          onPress={() => {
            // eslint-disable-next-line no-lone-blocks
            {
              loginHandler(data.email, data.password);
            }
          }}>
          <Text style={(styles.loginText, {color: 'white'})}>LOGIN</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('SignupScreen')}>
          <Text style={styles.forgot}>Register now</Text>
        </TouchableOpacity>
      </ImageBackground>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  forgot: {
    color: 'white',
    fontSize: 17,
    textDecorationLine: 'underline',
  },
  loginBtn: {
    width: '50%',
    backgroundColor: 'steelblue',
    borderRadius: 10,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '10%',
    marginBottom: '3%',
  },
  inputView: {
    width: '80%',
    backgroundColor: '#D8D8D8',
    borderRadius: 5,
    height: 50,
    marginBottom: '2%',
    justifyContent: 'center',
    padding: 20,
  },
  inputText: {
    height: 50,
    color: 'black',
  },
  logo: {resizeMode: 'contain', height: 200, width: 200, marginBottom: 40},
});

export default SigninScreen;
