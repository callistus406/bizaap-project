import React, { useContext, useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  Modal,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Keyboard,
  sectionList,
  Alert,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { COLORS, SIZES, FONTS } from '../constant';
import Input from '../component/Inputs';
import CustomButton from '../component/CustomBotton';
import Loader from '../component/Loader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { AuthContext } from '../component/context';



const LoginScreen = ({navigation}) => {

  const {signIn} = React.useContext(AuthContext);


  const [errors, setErrors] = React.useState({});
  const [message, setMessage] = React.useState('');

   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [seePassword, setSeePassword] = useState(true);
   const [checkValidEmail, setCheckValidEmail] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
     const [userToken, setUserToken] = useState(null);
     const [userInfo, setUserInfo] = useState(null);
  

   const handleCheckEmail = (text) => {
     let re = /\S+@\S+\.\S+/;
     let regex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;

     setEmail(text);
     if (re.test(text) || regex.test(text)) {
       setCheckValidEmail(false);
     } else {
       setCheckValidEmail(true);
     }
   };

    const checkPasswordValidity = (value) => {
      const isNonWhiteSpace = /^\S*$/;
      if (!isNonWhiteSpace.test(value)) {
        return 'Password must not contain Whitespaces.';
      }

      const isContainsUppercase = /^(?=.*[A-Z]).*$/;
      if (!isContainsUppercase.test(value)) {
        return 'Password must have at least one Uppercase Character.';
      }

      const isContainsLowercase = /^(?=.*[a-z]).*$/;
      if (!isContainsLowercase.test(value)) {
        return 'Password must have at least one Lowercase Character.';
      }

      const isContainsNumber = /^(?=.*[0-9]).*$/;
      if (!isContainsNumber.test(value)) {
        return 'Password must contain at least one Digit.';
      }

      const isValidLength = /^.{8,16}$/;
      if (!isValidLength.test(value)) {
        return 'Password must be 8-16 Characters Long.';
      }

       const isContainsSymbol =
         /^(?=.*[~`!@#$%^&*()--+={}\[\]|\\:;"'<>,.?/_₹]).*$/;
       if (!isContainsSymbol.test(value)) {
         return 'Password must contain at least one Special Symbol.';
       }

      return null;
    };

   const handleLogin = (email, password) => {
      const checkPassowrd = checkPasswordValidity(password);
      if (!checkPassowrd) {
       signIn(email, password)
      } else {
        alert(checkPassowrd);
      }
    };

 
  return (
    <View style={{ backgroundColor: COLORS.white, flex: 1, paddingTop: 3 }}>
      <StatusBar backgroundColor={COLORS.white} barStyle="dark-content" />
      <Loader visible={isLoading} />
      <ScrollView
        contentContainerStyle={{
          paddingTop: 54,
          paddingHorizontal: 20,
        }}>
        <Text style={{ paddingTop: 50, color: COLORS.black, ...FONTS.h1, fontWeight: 'bold' }}>Login</Text>
        <Text style={{ paddingTop: 5, color: COLORS.black, ...FONTS.body4 }}>Login and get started</Text>
        <View style={{ marginVertical: 20, marginBottom: 5 }}>
          <View style={style.wrapperInput}>
            <TextInput
              style={{ padding: 10, width: '100%' }}
              placeholder="Email"
              autoCapitalize="none"
              value={email}
              onChangeText={(text) => handleCheckEmail(text)}
            />
          </View>
          {checkValidEmail ? (
            <Text style={style.textFailed}>Wrong format email</Text>
          ) : (
            <Text style={style.textFailed}> </Text>
          )}
          <View style={style.wrapperInput}>
            <TextInput
              style={{ padding: 10, width: '100%' }}
              placeholder="Password"
              value={password}
              secureTextEntry={seePassword}
              onChangeText={(text) => setPassword(text)}
            />
          </View>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 3, marginBottom: 10 }}>
          <TouchableOpacity style={style.inputCard}></TouchableOpacity>
          <Text style={{ color: COLORS.black, ...FONTS.body4, flex: 1 }}>Remember Me</Text>
          <Text style={{ color: COLORS.black, ...FONTS.body4 }}>ForgetPassword</Text>
        </View>
        {email == '' || password == '' || checkValidEmail == true ? (
          <TouchableOpacity disabled style={style.buttonDisable} onPress={() => {handleLogin(email, password)}}>
            <Text style={{ color: 'white', fontWeight: 'bold' }}>Login</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={style.button} onPress={() => {
            handleLogin(email, password);
          }}>
            <Text style={style.text}>Login</Text>
          </TouchableOpacity>
        )}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 10 }}>
          <Text style={{ color: COLORS.black, ...FONTS.body4 }}>Dont have an account?</Text>
          <Text
            onPress={() => navigation.navigate('Register')}
            style={{ color: COLORS.primary, ...FONTS.body4, paddingLeft: 3 }}>
            Create
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const style = StyleSheet.create({
  inputCard: {
    height: 18,
    width: 19,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius / 10,
    borderWidth: 1,
    marginTop: 0.2,
    marginRight: 7,
    borderColor: COLORS.gray,
  },
  inputContainer: {
    height: 45,
    borderWidth: 1,
    borderRadius: 18,
    paddingHorizontal: 5,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
  },
  wrapperInput: {
    borderWidth: 0.5,
    borderRadius: 5,
    borderColor: 'grey',
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textFailed: {
    alignSelf: 'flex-end',
    color: 'red',
  },
  buttonDisable: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.gray,
    borderRadius: 5,
    marginTop: 25,
  },
  button: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: 5,
    marginTop: 25,
  },
});


export default LoginScreen;
