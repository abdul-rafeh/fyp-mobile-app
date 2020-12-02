import React, {Component, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Image,
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

  return (
    <View style={styles.container}>
      {/* <Image
        source={require('../images/sample-logo-design-png-3.png')}
        style={styles.logo}
      /> */}
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
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  forgot: {
    color: '#808080',
    fontSize: 11,
  },
  loginBtn: {
    width: '50%',
    backgroundColor: '#e4ca62',
    borderRadius: 240,
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
  logo: {resizeMode: 'contain', height: 200, width: 200, marginBottom: '18%'},
});

export default SigninScreen;
