import { Image, StyleSheet, TextInput, View } from "react-native";
import { Colors } from '@/constants/Colors';
import { MaterialIcons } from "@expo/vector-icons";

const CustomTextField = (props:any) => {
  return(
    <View style={styles.textField}>
      <MaterialIcons style={styles.image} name={props.image} size={24} />
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
    alignItems: "center",
    justifyContent: "center",
    borderBottomColor: Colors.gymme.placeholder,
    borderBottomWidth: 2,
    marginBottom: 8
  },
  image: {
    marginHorizontal: 10,
  },
  textInput: {
    flex: 1,
    padding: 10,
    fontSize: 12,
    alignItems: 'center',
    fontFamily: 'Poppins'
  }
})

export default CustomTextField




