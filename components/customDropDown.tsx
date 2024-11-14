import { Image, StyleSheet, View } from "react-native";
import { Colors } from '@/constants/Colors';
import DropDownPicker from 'react-native-dropdown-picker';
import { useState } from "react";

const CustomDropDown = (props:any) => {
  const [open, setOpen] = useState(props.open);
  const [value, setValue] = useState(props.value);
  const [items, setItems] = useState(props.items);

  return(
    <View style={styles.textField}>
      <Image style={styles.image} source={props.image}></Image>
      <DropDownPicker
        style = {styles.dropdownPicker}
        open = {open}
        value = {value}
        items = {items}
        setOpen = {setOpen}
        setValue = {setValue}
        placeholder= {props.placeholderText}
        containerStyle = {{flex : 1}}
        dropDownContainerStyle = {{backgroundColor:'white', zIndex : 10, position:'absolute', top: 45}}
      />
    </View>
  )  
}

const styles = StyleSheet.create({
  textField: {
    flexDirection: 'row',
    borderBottomColor: Colors.gymme.placeholder,
    borderBottomWidth: 2,
    marginBottom: 10,
  },
  image: {
    margin: 10,
    width: 24,
    height: 24,
    resizeMode: 'contain'
  },
  dropdownPicker: {
    // color: Colors.gymme.placeholder,
    zIndex: 10,
    padding: 10,
    fontSize: 14,
    alignItems: 'center',
    fontFamily: 'Poppins',
    borderColor: '#fff'
  }
})

export default CustomDropDown




