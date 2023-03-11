import { Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');

export const COLORS = {
  //base colors
  primary: '#f7a400', // green

  secondary: '#ffd100',

  gray: '#c4c4c4',

  lightGray: '#474646',

  lightBlue: '#83B6D5',

  lightGreen: '#55CF56',

  lightPurple: '#FF5733',

  lightPink: '#FFDBE9',

  red: '#CA0C3A',

  black: '#000000',

  white: '#ffffff',

  blue: '#0000b3',

  pink: '#ff5733',
  yellow: '#FFFF00',

  transparent: 'transparent',
};

export const SIZES = {
  // global sizes
  base: 8,
  font: 14,
  radius: 30,
  padding: 10,
  padding2: 12,

  //font sizes
  largeTitle: 50,
  h1: 30,
  h2: 22,
  h3: 20,
  h4: 10,
  body1: 30,
  body2: 20,
  body3: 16,
  body4: 14,
  body5: 12,

  //app dimensions
  width,
  height,
};

export const FONTS = {
  largeTitle: { fontFamily: 'Poppins-regular', fontSize: SIZES.largeTitle, lineHeight: 40 },
  h1: { fontFamily: 'Poppins-Black', fontSize: SIZES.h1, lineHeight: 36 },
  h2: { fontFamily: 'Poppins-Bold', fontSize: SIZES.h2, lineHeight: 30 },
  h3: { fontFamily: 'Poppins-Bold', fontSize: SIZES.h3, lineHeight: 22 },
  h4: { fontFamily: 'Poppins-Bold', fontSize: SIZES.h4, lineHeight: 22 },
  body1: { fontFamily: 'Poppins-Black', fontSize: SIZES.body1, lineHeight: 36 },
  body2: { fontFamily: 'Poppins-Black', fontSize: SIZES.body2, lineHeight: 30 },
  body3: { fontFamily: 'Poppins-Black', fontSize: SIZES.body3, lineHeight: 22 },
  body4: { fontFamily: 'Poppins-Black', fontSize: SIZES.body4, lineHeight: 22 },
  body5: { fontFamily: 'Poppins-Black', fontSize: SIZES.body5, lineHeight: 22 },
};

const appTheme = { COLORS, SIZES, FONTS };

export default appTheme;
