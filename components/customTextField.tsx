import { Image, StyleSheet, TextInput, View } from "react-native";
import { Colors } from '@/constants/Colors';

const CustomTextField = (props:any) => {
  return(
    <View style={styles.textField}>
      <Image style={styles.image} source={props.image}></Image>
      <TextInput
        style={styles.textInput}
        value={props.value}
        onChangeText={props.setValue}
        placeholder={props.placeholderText}
        placeholderTextColor={Colors.gymme.placeholder}
        secureTextEntry={props.secure}
        underlineColorAndroid="transparent">
      </TextInput>
    </View>
  )  
}

const styles = StyleSheet.create({
  textField: {
    flexDirection: 'row',
    borderBottomColor: Colors.gymme.placeholder,
    borderBottomWidth: 2,
    marginBottom: 10,
    zIndex: -1
  },
  image: {
    margin: 10,
    width: 24,
    height: 24,
    resizeMode: 'contain'
  },
  textInput: {
    flex: 1,
    padding: 10,
    fontSize: 14,
    alignItems: 'center',
    fontFamily: 'Poppins'
  }
})

export default CustomTextField




