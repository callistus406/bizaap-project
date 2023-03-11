import React from 'react';
import { COLORS, FONTS } from '../constant';
import { View, TouchableOpacity, Text } from 'react-native';

const CustomButton = ({ title, onPress = () => {} }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={{
        height: 50,
        width: '100%',
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        borderRadius: 18,
        alignItems: 'center',
        marginVertical: 20,
      }}>
      <Text style={{ color: COLORS.white, fontSize: 18, fontWeight: 'bold' }}>{title}</Text>
    </TouchableOpacity>
  );
};

export default CustomButton;