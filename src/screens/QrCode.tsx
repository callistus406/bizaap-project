import React, { useEffect, useState } from 'react';
import { COLORS, icon, SIZES } from '../constant';
import { Text, View, StyleSheet, TextInput, TouchableOpacity, Image } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { ScrollView } from 'react-native';
import axiosInstance from '../Helpers/axios';
import { ColorPicker } from 'react-native-color-picker';


const QrCode = () => {
  const [inputText, setInputText] = useState('');
  const [qrvalue, setQrvalue] = useState('');
  const [downloadKey, setDownloadKey] = useState(null);

     
  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={{
          paddingTop: 20,
          marginHorizontal: 15,
        }}>
        <Text
          style={{
            textAlign: 'center',
            textAlignVertical: 'center',
            fontSize: 16,
            fontWeight: 'bold',
            marginBottom: 20,
          }}>
          QR Code Generator
        </Text>
        <View style={{ flexDirection: 'row' }}>
          <View style={styles.textInput}>
            <TextInput
              onChangeText={(inputText) => setInputText(inputText)}
              placeholder="Enter any value"
              value={inputText}
            />
          </View>
          <TouchableOpacity style={styles.buttonText} onPress={() => setQrvalue(inputText)}>
            <Text style={styles.textAlign}>Generate</Text>
          </TouchableOpacity>
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: 5 }}>
          <View style={{ flexDirection: 'row' }}>
            <Text>Background Color:</Text>
            <ColorPicker
              onColorSelected={(color) => alert(`Color selected: ${color}`)}
              style={{ height: 100, width: 100, marginLeft: -20 }}
            />
          </View>
          <Text>Dimension:</Text>
        </View>
        <View style={{ alignItems: 'center', marginTop: 30 }}>
          <QRCode
            value={qrvalue ? qrvalue : 'Payment'}
            size={210}
            color="black"
            backgroundColor="white"
            /*logo={{
            url:
              'https://raw.githubusercontent.com/AboutReact/sampleresource/master/logosmalltransparen.png',
          }}
          logoSize={30}
          logoMargin={2}
          logoBorderRadius={15}
          logoBackgroundColor="yellow"*/
          />
        </View>
        <TouchableOpacity style={styles.buttonStyle} onPress={() => setQrvalue(inputText)}>
          <Text style={styles.buttonTextStyle}>Download</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  titleStyle: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  textStyle: {
    textAlign: 'center',
    margin: 10,
  },
  textInputStyle: {
    flexDirection: 'row',
    height: 40,
    marginTop: 20,
    marginLeft: 35,
    marginRight: 35,
    textAlign: 'center',
    margin: 10,
  },
  buttonStyle: {
    backgroundColor: COLORS.primary,
    color: '#FFFFFF',
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 30,
    padding: 5,
  },
  buttonTextStyle: {
    color: '#FFFFFF',
    paddingVertical: 10,
    fontSize: 16,
  },
  textInput: {
    height: 50,
    width: '65%',
    borderWidth: 0.5,
    borderRadius: 5,
    margin: 5,
    marginBottom: 25,
  },
  buttonText: {
    backgroundColor: COLORS.primary,
    height: 50,
    width: 105,
    borderRadius: 5,
    margin: 5,
    justifyContent: 'center',
    marginLeft: -2,
  },
  textAlign: {
    marginHorizontal: 10,
    color: COLORS.white,
    fontSize: 16,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
});

export default QrCode;
