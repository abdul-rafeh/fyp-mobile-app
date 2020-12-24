import React, {Component} from 'react';
import {Text, View} from 'react-native';
import Header from './Header';
export default class DashboardScreen extends Component {
  render() {
    return (
      <View>
        <Header {...this.props} />
        <Text> DashboardScreen </Text>
      </View>
    );
  }
}
