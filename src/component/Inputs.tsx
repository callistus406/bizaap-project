import React from 'react';
import { View, Text, StyleSheet, TextInput, Image } from 'react-native';
import { COLORS, FONTS } from '../constant';

const Input = ({ label, iconName, error, value, password, onFocus = () => {}, ...props }) => {
  const [isFocused, setIsFocused] = React.useState(false);
  const [hidePassword, setHidePassword] = React.useState(password);
  return (
    <View style={{ marginBottom: 20 }}>
      <View
        style={[
          style.inputContainer,
          { borderColor: error ? COLORS.red : isFocused ? COLORS.primary : COLORS.gray },
        ]}
      >
        <TextInput
          secureTextEntry={hidePassword}
          autoCorrect={false}
          onFocus={() => {
            onFocus();
            setIsFocused(true);
          }}
          onBlur={() => {
            setIsFocused(false);
          }}
          style={{ color: COLORS.black, flex: 1, ...FONTS.body3 }}
          {...props}
        />
        {password && (
          <Icon
            onPress={() => setHidePassword(!hidePassword)}
            style={{ fontSize: 21, color: COLORS.primary }}
            name={hidePassword ? 'visibility' : 'visibility-off'}
          />
        )}
      </View>
      {error && <Text style={{ color: COLORS.red, ...FONTS.body4, marginTop: 5 }}>{error}</Text>}
    </View>
  );
};

const style = StyleSheet.create({
  inputContainer: {
    height: 45,
    borderWidth: 1,
    borderRadius: 18,
    paddingHorizontal: 5,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
  },
});

export default Input;
