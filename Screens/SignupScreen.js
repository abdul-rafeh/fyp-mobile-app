/* eslint-disable no-lone-blocks */
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Image,
} from 'react-native';
import {AuthContext} from '../Components/context';
export function SignupScreen({navigation}) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [data, setData] = React.useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const {register} = React.useContext(AuthContext);

  const registerHandler = (firstName, lastName, email, password) => {
    register(firstName, lastName, email, password);
  };

  const emailInputChange = (val) => {
    setData({
      ...data,
      email: val,
    });
  };
  const firstNameInputChange = (val) => {
    setData({
      ...data,
      firstName: val,
    });
  };
  const lastNameInputChange = (val) => {
    setData({
      ...data,
      lastName: val,
    });
  };
  const handlePasswordChange = (val) => {
    setData({
      ...data,
      password: val,
    });
  };
  const handleConfirmPasswordChange = (val) => {
    setData({
      ...data,
      confirmPassword: val,
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
          placeholder="First Name"
          placeholderTextColor="#808080"
          onChangeText={(val) => firstNameInputChange(val)}
        />
      </View>
      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="Last Name"
          placeholderTextColor="#808080"
          onChangeText={(val) => lastNameInputChange(val)}
        />
      </View>
      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="Email"
          placeholderTextColor="#808080"
          onChangeText={(val) => emailInputChange(val)}
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
      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          secureTextEntry
          placeholder="Confirm Password"
          placeholderTextColor="#808080"
          onChangeText={(val) => handleConfirmPasswordChange(val)}
        />
      </View>

      <TouchableOpacity
        style={styles.loginBtn}
        onPress={() => {
          {
            registerHandler(
              data.firstName,
              data.lastName,
              data.email,
              data.password,
              data.confirmPassword,
            ),
              navigation.goBack();
          }
        }}>
        <Text style={(styles.loginText, {color: 'white'})}>Register</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.forgot}>Already have an account?</Text>
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
    color: 'white',
  },
  logo: {resizeMode: 'contain', height: 200, width: 200, marginBottom: '18%'},
  footerText: {bottom: '2%', position: 'absolute'},
});

export default SignupScreen;
