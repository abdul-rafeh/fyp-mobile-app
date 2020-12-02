import React, {Component} from 'react';
import {Text, View, TouchableOpacity} from 'react-native';
import {Picker} from '@react-native-picker/picker';

import Header from './Header';
export default class WhoWillWin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      language: 'java',
    };
  }
  render() {
    return (
      <View>
        <Header {...this.props} />
        <Picker
          selectedValue={this.state.language}
          style={{height: 50, width: 100}}
          onValueChange={(itemValue, itemIndex) =>
            this.setState({language: itemValue})
          }>
          <Picker.Item label="Java" value="java" />
          <Picker.Item label="JavaScript" value="js" />
        </Picker>
      </View>
    );
  }
}
