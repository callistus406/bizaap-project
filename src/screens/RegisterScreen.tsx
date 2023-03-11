import React, { useState } from 'react';
import {
  View,
  Text,
 TouchableOpacity,
  Image,
  FlatList,
  Modal,
  ScrollView,
  StatusBar,
  TextInput,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  ActivityIndicator,
  Button,
  Keyboard,
  Alert,
} from 'react-native';
import { COLORS, FONTS, SIZES } from '../constant/theme';
import Input from '../component/Inputs';
import CustomButton from '../component/CustomBotton';
import Loader from '../component/Loader';


const RegisterScreen = ({navigation}) => {

  const [inputs, setInputs] = React.useState({
    email: '',
    businessname: '',
    phone: '',
    password: '',
  });

  const [errors, setErrors] = React.useState({});
  const [Loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState('');

   const validate = () => {
     let valid = true;
     if (!inputs.businessname) {
       handleError('Please input businessname', 'businessname');
       valid = false;
     }
     if (!inputs.email) {
       handleError('Please enter email', 'email');
       valid = false;
     } else if (!inputs.email.match(/\S+@\S+\.\S+/)) {
       handleError('Please input valid email', 'email');
       valid = false;
     }
     if (!inputs.phone) {
       handleError('Please input phone number', 'phone');
       valid = false;
     }
     if (!inputs.password) {
       handleError('Please input password', 'password');
       valid = false;
     } else if (inputs.password.length < 8) {
       handleError('Min password length of 8', 'password');
       valid = false;
     }
     if (valid) {
       register();
     }
   };

    const register = () => {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);

        fetch('http://192.168.43.95:5000/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(inputs),
        })
          .then(async (res) => {
            console.log(res);
            try {
              const jsonRes = await res.json();
              if (res.status !== 200) {
                setErrors(true);
                setMessage(jsonRes.message);
              } else {
                setErrors(false);
                setMessage(jsonRes.message);
              }
              navigation.navigate('Login');
            } catch (err) {
              console.log(err);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }, 3000);
    };

   
  const handleOnChange = (text, input) => {
    setInputs((prevState) => ({ ...prevState, [input]: text }));
  };

  const handleError = (errorMessage, input) => {
    setErrors((prevState) => ({ ...prevState, [input]: errorMessage }));
  };


  return (
    <View style={{ backgroundColor: COLORS.white, flex: 1 }}>
      <StatusBar backgroundColor={COLORS.white} barStyle="dark-content" />
      <Loader visible={Loading} />
      <ScrollView
        contentContainerStyle={{
          paddingTop: 30,
          paddingHorizontal: 20,
        }}>
        <Text style={{ paddingTop: 20, color: COLORS.black, ...FONTS.h1, fontWeight: 'bold' }}>Register</Text>
        <Text style={{ paddingTop: 5, color: COLORS.black, ...FONTS.body4 }}>Register and get started</Text>
        <View style={{ marginVertical: 20, paddingTop: 10 }}>
          <Input
            placeholder="Email"
            autoCapitalize="none"
            error={errors.email}
            onFocus={() => {
              handleError(null, 'email');
            }}
            onChangeText={(text) => handleOnChange(text, 'email')}
          />
          <Input
            placeholder="BusinessName"
            error={errors.businessname}
            onFocus={() => {
              handleError(null, 'businessname');
            }}
            onChangeText={(text) => handleOnChange(text, 'businessname')}
          />
          <Input
            placeholder="Phone"
            keyboardType="numeric"
            error={errors.phone}
            onFocus={() => {
              handleError(null, 'phone');
            }}
            onChangeText={(text) => handleOnChange(text, 'phone')}
          />
          <Input
            placeholder="Password"
            error={errors.password}
            onFocus={() => {
              handleError(null, 'password');
            }}
            onChangeText={(text) => handleOnChange(text, 'password')}
          />
        </View>
        <View style={{ flexDirection: 'row', paddingTop: 2 }}>
          <TouchableOpacity
            style={{
              height: 18,
              width: 19,
              backgroundColor: COLORS.white,
              borderRadius: 2,
              borderWidth: 1,
              marginTop: 0.2,
              marginRight: 7,
              borderColor: COLORS.primary,
            }}></TouchableOpacity>
          <Text style={{ color: COLORS.black, ...FONTS.body4, marginTop: 0.2 }}>By signing you accept the</Text>
          <Text style={{ color: COLORS.red, ...FONTS.body4, paddingLeft: 3, marginTop: 0.2 }}>Terms of service</Text>
          <Text style={{ color: COLORS.black, ...FONTS.body4, paddingLeft: 3, marginTop: 0.2 }}>and</Text>
        </View>
        <Text style={{ color: COLORS.red, ...FONTS.body4, paddingLeft: 27 }}>Private Policy</Text>
        <CustomButton title="Sign Up" onPress={validate} />
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
          <Text style={{ color: COLORS.black, ...FONTS.body4, paddingLeft: 50 }}>Already have an account?</Text>
          <TouchableOpacity>
            <Text onPress={() => navigation.navigate('Login')} style={{ color: COLORS.primary, ...FONTS.body4 }}>
              Login
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default RegisterScreen;
