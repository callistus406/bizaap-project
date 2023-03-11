/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { AuthContext } from './src/component/context';
import { NavigationContainer } from '@react-navigation/native';
import { AuthNavigator, DrawerNavigator } from './src/navigation';
import axiosInstance from './src/Helpers/axios';
import { View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';



const App = () => {
 // const [isLoading, setIsLoading] = React.useState(true);
 // const [userToken, setUserToken] = React.useState(null);
 const [userInfo, setUserInfo] = React.useState();

 const initialLoginState = {
  isLoading: true,
  email: null,
  userToken: null,
 };

 const loginReducer = (prevState, action) => {
  switch (action.type) {
    case 'RETRIEVE_TOKEN':
      return {
        ...prevState,
        userToken: action.token,
        isLoading: false,
      };
    case 'LOGIN':
      return {
        ...prevState,
        email: action.email,
        userToken: action.token,
        isLoading: false,
      };
    case 'LOGOUT':
      return {
        ...prevState,
        email: null,
        userToken: null,
        isLoading: false,
      };
    case 'REGISTER':
      return {
        ...prevState,
        email: action.email,
        userToken: action.token,
        isLoading: false,
      };
  }
 };

 const [loginState, dispatch] = React.useReducer(loginReducer,initialLoginState);

 
  const authContext = React.useMemo(() => ({
    signIn: (email, password) => {
     // setUserToken('fjiu');
     // setIsLoading(false);

       axiosInstance.post('login', {
         email,
         password,
       })
       .then(async res => {
        console.log(res.data)
        let userInfo = res.data;
        setUserInfo(userInfo);
          if (res.status == 200) {   
            try {
              await AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
               AsyncStorage.setItem('userToken', userInfo.data.token);
            } catch (err) {
              console.log(err);
            } 
          }
          dispatch({ type: 'LOGIN', email: email, token: userToken})
       })
      .catch((err) => {
        console.log(err)
      })
    },

    signOut: async () => {
      //setUserToken(null);
      //setIsLoading(false);
       try {
              await AsyncStorage.removeItem('userToken');
            } catch(err) {
              console.log(err);
            } 
      dispatch({ type: 'LOGOUT' });
    },

    signUp: () => {
      setUserToken('fjiu');
    },
  }), []);

  useEffect(() => {
    setTimeout(async () => {
      //setIsLoading(false);
      let userToken;
      userToken = null;
        try {
           userToken = await AsyncStorage.getItem('userToken');
            } catch(err) {
              console.log(err);
            }  
      dispatch({ type: 'REGISTER', token: userToken });
    }, 1000);
  }, []);

  if (loginState.isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size={'large'} />
      </View>
    );
  }

  return (
    <AuthContext.Provider value={authContext}>
    <NavigationContainer>
    { loginState.userToken !== null ? (
      <DrawerNavigator />
    )
    :
    <AuthNavigator />
    }
      </NavigationContainer>
    </AuthContext.Provider>
  ); 
}

export default App;
