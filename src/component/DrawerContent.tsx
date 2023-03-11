import React, { useContext, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';
import { COLORS } from '../constant';
import {
  Avatar,
  Caption,
  Headline,
  Paragraph,
  Subheading,
  Title,
  Drawer,
  Text,
  TouchableRipple,
  Switch,
} from 'react-native-paper';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { AuthContext } from './context';
import SettingScreen from '../screens/SettingsScreen.tsx';

const DrawerContent = (props) => {
  const menuItems = [
    {
      icon: <FontAwesome name="gears" size={20} />,
      name: 'Settings',
      onPress: () => {
        navigation.navigate(settingScreen);
      },
    },
    { icon: <FontAwesome name="arrow-right" size={20} /> },
  ];

  const {signOut} = React.useContext(AuthContext);

  const [isDarkTheme, setIsDarkTheme] = React.useState(false);

  const toggleTheme = () => {
    -setIsDarkTheme(!isDarkTheme);
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.white }}>
      <DrawerContentScrollView {...props} contentContainerStyle={{ backgroundColor: '#f6f6f6' }}>
        <ImageBackground style={{ padding: 20 }}>
          <Avatar.Image
            source={{
              uri: 'https://th.bing.com/th/id/OIP.x7X2oAehk5M9IvGwO_K0PgHaHa?w=164&h=180&c=7&r=0&o=5&pid=1.7',
            }}
            size={50}
            style={{ marginBottom: 10 }}
          />
          <Text style={{ fontSize: 16, marginTop: 3, fontWeight: 'bold', marginLeft: 10 }}>
            eSTILO
          </Text>
        </ImageBackground>
        <View style={{ backgroundColor: COLORS.white }}>
          <DrawerItemList {...props} />
          <DrawerItem
            icon={({ color, size }) => {
              return <FontAwesome name="credit-card" size={20} color={COLORS.primary} />;
            }}
            label="Transaction"
            onPress={() => {}}
          />
          <DrawerItem
            icon={({ color, size }) => {
              return <FontAwesome name="qrcode" size={20} color={COLORS.primary} />;
            }}
            label="QrCode"
            onPress={() => {
              props.navigation.navigate('QrCode');
            }}
          />
          <DrawerItem
            icon={({ color }) => {
              return <FontAwesome name="money" size={20} color={COLORS.primary} />;
            }}
            label="Receipt"
            onPress={() => {}}
          />
          <DrawerItem
            icon={({ color, size }) => {
              return <FontAwesome name="sign-out" size={20} color={COLORS.primary} />;
            }}
            label="Profile"
            onPress={() => {
              props.navigation.navigate('Profile');
            }}
          />
          <DrawerItem
            icon={({ color, size }) => {
              return <FontAwesome name="wrench" size={20} color={COLORS.primary} />;
            }}
            label="Settings"
            onPress={() => {}}
          />
          <Drawer.Section title="Preferences" />
          <TouchableRipple
            onPress={() => {
              toggleTheme();
            }}
          >
            <View style={style.preference}>
              <Text>Dark Theme</Text>
              <View pointerEvents="none">
                <Switch value={isDarkTheme} />
              </View>
            </View>
          </TouchableRipple>
        </View>
      </DrawerContentScrollView>
      <View style={style.bottomDrawerSection}>
        <DrawerItem
          icon={({ color, size }) => {
            return <FontAwesome name="sign-out" size={20} color={COLORS.primary} />;
          }}
          label="Logout"
          onPress={() => {
            signOut();
          }}
        />
      </View>
    </View>
  );
};

const style = StyleSheet.create({
  drawerContent: {
    flex: 1,
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
  scetion: {
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
    marginTop: 15,
    borderTopColor: COLORS.black,
    borderTopWidth: 1,
  },
  preference: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
});

export default DrawerContent;
