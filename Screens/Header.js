import React, {Component} from 'react';
import {Text, View, TouchableOpacity, SafeAreaView} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {DrawerActions} from '@react-navigation/native';

export default class Header extends Component {
  render() {
    return (
      // eslint-disable-next-line react-native/no-inline-styles
      <>
        <SafeAreaView>
          <View
            style={{
              paddingLeft: 13,
              height: 35,
              flexDirection: 'row',
            }}>
            <TouchableOpacity
              onPress={() =>
                this.props.navigation.dispatch(DrawerActions.openDrawer())
              }>
              <Icon name="menu" color={'rgba(28, 28, 30, 0.68)'} size={30} />
            </TouchableOpacity>
            {/* <View style={{paddingLeft: 50}}> */}
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                flex: 2,
                right: 20,
              }}>
              <Text
                style={{
                  fontWeight: 'bold',
                  fontSize: 17,
                  color: '#606060',
                }}>
                {this.props.route.name === 'DashboardScreen'
                  ? 'Dashboard'
                  : null}
                {this.props.route.name === 'WhoWillWin'
                  ? 'ODI Prediction'
                  : null}
                {this.props.route.name === 'T20Screen'
                  ? 'T20 Prediction'
                  : null}
                {this.props.route.name === 'BatsmanODIScreen'
                  ? 'Batsman ODI Score'
                  : null}
                {this.props.route.name === 'BatsmanT20Screen'
                  ? 'Batsman T20 Score'
                  : null}
              </Text>
            </View>
          </View>
        </SafeAreaView>
      </>
    );
  }
}
