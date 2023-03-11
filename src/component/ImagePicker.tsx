import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const ImagePicker = () => {
  const refRBSheet = useRef();

  const options = [
    {
      name: 'Take from Camera',
      icon: <FontAwesome name="camera" />,
      onPress: () => {},
    },
    {
      name: 'Choose from Photo',
      icon: <FontAwesome name="picture-o" />,
      onPress: () => {},
    },
  ];
  return (
    <RBSheet
      ref={refRBSheet}
      closeOnDragDown={true}
      closeOnPressMask={false}
      customStyles={{
        wrapper: {
          backgroundColor: 'transparent',
        },
        draggableIcon: {
          backgroundColor: '#000',
        },
      }}
    >
      {options.map(({ name, icon, onPress }) => (
        <TouchableOpacity key={name}>
          {icon}
          <Text>{name}</Text>
        </TouchableOpacity>
      ))}
    </RBSheet>
  );
};

export default ImagePicker;
