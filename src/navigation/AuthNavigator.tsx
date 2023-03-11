import React from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoginScreen, RegisterScreen } from '../screens';


const AuthNavigator = () => {
   const AuthStack = createNativeStackNavigator();
   return (
     <AuthStack.Navigator screenOptions={{ headerShown: false }}>
       <AuthStack.Screen name="Register" component={RegisterScreen} />
       <AuthStack.Screen name="Login" component={LoginScreen} />
     </AuthStack.Navigator>
   );
};

export default AuthNavigator;