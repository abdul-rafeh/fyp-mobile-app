import React, {Component} from 'react';
import {Text, View, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {DrawerActions} from '@react-navigation/native';
export default class Header extends Component {
  render() {
    return (
      // eslint-disable-next-line react-native/no-inline-styles
      <View style={{marginTop: 50, paddingLeft: 13}}>
        <TouchableOpacity
          onPress={() =>
            this.props.navigation.dispatch(DrawerActions.openDrawer())
          }>
          <Icon name="menu" color={'rgba(28, 28, 30, 0.68)'} size={30} />
        </TouchableOpacity>
      </View>
    );
  }
}
