import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Deposit, HomeScreen, QrCode, TopUp, Transfer, Withdraw } from '../screens';


const MainNavigator = () => {
  const MainStack = createNativeStackNavigator();
  return (
    <MainStack.Navigator screenOptions={{ headerShown: false }}>
      <MainStack.Screen name="HomeScreen" component={HomeScreen} />
      <MainStack.Screen name="Transfer" component={Transfer} />
      <MainStack.Screen name="Deposit" component={Deposit} />
      <MainStack.Screen name="TopUp" component={TopUp} />
      <MainStack.Screen name="Withdraw" component={Withdraw} />
      <MainStack.Screen name="QrCode" component={QrCode} />
    </MainStack.Navigator>
  );
};

export default MainNavigator;
