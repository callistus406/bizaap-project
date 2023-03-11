import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  Modal,
  keyboard,
} from 'react-native';
import CustomButton from '../component/CustomBotton';
import { COLORS, SIZES, images } from '../constant';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { BarChart } from 'react-native-chart-kit';
import Button from 'react-native-button';
import { SlideModal } from 'react-native-slide-modal';


const Deposit = () => {

  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [name, setName] = useState('');

  const [modalVisible, setModalVisible] = useState(false);

  const [text, onChangeText] = React.useState('');
  const [number, setNumber] = useState();

  const numbers = [
    {
      letter: [1, 2, 3, 4, 5, 6, 7, 8, 9, 0]
    }
  ]
  
 return (
   <View style={{ flex: 1, backgroundColor: COLORS.white }}>
     <Modal
       animationType="slide"
       transparent={true}
       visible={modalVisible}
       onRequestClose={() => {
         Alert.alert('Modal has been closed.');
         setModalVisible(!modalVisible);
       }}>
       <View style={style.centeredView}>
         <View style={style.modalView}>
           <Image source={images.tapPay} style={{ height: 300, width: '80%' }} />
           <TouchableOpacity style={[style.button, style.buttonClose]} onPress={() => setModalVisible(!modalVisible)}>
             <Text style={style.textStyle}>Scan to pay</Text>
           </TouchableOpacity>
         </View>
       </View>
     </Modal>
     <ScrollView
       contentContainerStyle={{
         paddingTop: 3,
         paddingHorizontal: 20,
         alignItems: 'center',
       }}>
       <View style={style.card}>
         <Text style={{ color: COLORS.white, fontSize: 20, paddingTop: 10 }}>Balance</Text>
         <View style={{ flexDirection: 'row' }}>
           <Text style={{ color: COLORS.white, fontSize: 16, paddingTop: 10, fontWeight: '900' }}>NGN</Text>
           <Text style={{ color: COLORS.white, fontSize: 16, paddingTop: 10, paddingLeft: 5, fontWeight: '900' }}>
             0.00
           </Text>
         </View>
       </View>
       <Text style={{ fontSize: 20, fontWeight: 'bold', marginTop: 2, marginBottom: 10 }}>Deposit</Text>
       <View keyboardShouldPersistTaps="always">
         <TextInput
           style={style.input}
           placeholder="Enter amount"
           utoFocus={true}
           onChangeText={(x) => setNumber(x)}
           value={number}
           blurOnSubmit={false}
         />
       </View>
       {numbers.map(({letter, index}) => {
        <Button
          key={index}
          containerStyle={{
            padding: 7,
            height: 30,
            overflow: 'hidden',
            borderRadius: 4,
            margin: 2,
            backgroundColor: 'white',
          }}>
          <View>{letter}</View>
          </Button>
       })}
       <CustomButton title={'Proceed'} onPress={() => setModalVisible(!modalVisible)} />
     </ScrollView>
   </View>
 );
};
const style = StyleSheet.create({
  inputContainer: {
    height: 45,
    borderBottomColor: COLORS.black,
    borderBottomWidth: 1,
    width: '100%',
    marginVertical: SIZES.padding,
    paddingHorizontal: 5,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
  },
  card: {
    height: 100,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 10,
    width: '100%',
    marginTop: 20,
    paddingHorizontal: 20,
  },
  input: {
    height: 45,
    margin: 12,
    width: '70%',
    borderWidth: 1,
    padding: 10,
  },
  button: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: COLORS.primary,
    width: '90%',
    height: '15%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: -40,
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 5,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '100%',
    height: '50%',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  keyboard: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginLeft: 5,
    marginRight: 5,
  },
});

export default Deposit;
