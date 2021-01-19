import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {
  useTheme,
  Avatar,
  Title,
  Caption,
  Paragraph,
  Drawer,
} from 'react-native-paper';
import {DrawerContentScrollView, DrawerItem} from '@react-navigation/drawer';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AuthContext} from '../Components/context';

export function DrawerContent(props) {
  // const getEmail = async () => {
  //   const [email, setEmail] = useState(null);
  //   let getEmailNow = null;
  //   getEmailNow = await AsyncStorage.getItem('email');
  //   setEmail(getEmailNow);
  // };
  const paperTheme = useTheme();

  const {signOut} = React.useContext(AuthContext);
  // const {email} = getEmail();
  return (
    <View style={{flex: 1}}>
      {/* {getEmail} */}
      <DrawerContentScrollView {...props}>
        <View style={styles.drawerContent}>
          <View style={styles.userInfoSection}>
            <View style={{flexDirection: 'row', marginTop: 15}}>
              <View style={{marginLeft: 15, flexDirection: 'column'}}>
                <Caption style={styles.caption}>Welcome back, </Caption>
                <Title style={styles.title}>rafeh@gmail.com</Title>
              </View>
            </View>
          </View>

          <Drawer.Section style={styles.drawerSection}>
            <DrawerItem
              icon={({color, size}) => (
                <Icon name="home-outline" color={color} size={size} />
              )}
              label="Dashboard"
              onPress={() => {
                props.navigation.navigate('DashboardContent');
              }}
            />
            <DrawerItem
              icon={({color, size}) => (
                <Icon name="cricket" color={color} size={size} />
              )}
              label="ODI Prediction"
              onPress={() => {
                props.navigation.navigate('WhoWillWin');
              }}
            />
            <DrawerItem
              icon={({color, size}) => (
                <Icon name="cricket" color={color} size={size} />
              )}
              label="T20 Prediction"
              onPress={() => {
                props.navigation.navigate('T20Screen');
              }}
            />
            <DrawerItem
              icon={({color, size}) => (
                <Icon name="cricket" color={color} size={size} />
              )}
              label="Batsman ODI Score"
              onPress={() => {
                props.navigation.navigate('BatsmanODIScreen');
              }}
            />
            <DrawerItem
              icon={({color, size}) => (
                <Icon name="cricket" color={color} size={size} />
              )}
              label="Batsman T20 Score"
              onPress={() => {
                props.navigation.navigate('BatsmanT20Screen');
              }}
            />
          </Drawer.Section>
        </View>
      </DrawerContentScrollView>
      <Drawer.Section style={styles.bottomDrawerSection}>
        <DrawerItem
          icon={({color, size}) => (
            <Icon name="exit-to-app" color={color} size={size} />
          )}
          label="Sign Out"
          onPress={() => {
            signOut();
          }}
        />
      </Drawer.Section>
    </View>
  );
}

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  userInfoSection: {
    paddingLeft: 20,
  },
  title: {
    fontSize: 16,
    marginTop: 3,
    fontWeight: 'bold',
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
  },
  row: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  paragraph: {
    fontWeight: 'bold',
    marginRight: 3,
  },
  drawerSection: {
    marginTop: 15,
  },
  bottomDrawerSection: {
    marginBottom: 15,
    borderTopColor: '#f4f4f4',
    borderTopWidth: 1,
  },
  preference: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
});
