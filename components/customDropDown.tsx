import { Image, StyleSheet, View } from "react-native";
import { Colors } from "@/constants/Colors";
import DropDownPicker from "react-native-dropdown-picker";
import { useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";

const CustomDropDown = (props: any) => {
  const [open, setOpen] = useState(props.open);
  const [value, setValue] = useState(props.value);
  const [items, setItems] = useState(props.items);

  const test = () => {
    console.log(value);
  };
  return (
    <View style={styles.textField}>
      <View style={{ alignItems: "center", justifyContent: "center" }}>
        <MaterialIcons style={styles.image} name={props.image} size={24} />
      </View>
      <DropDownPicker
        style={styles.dropdownPicker}
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        onChangeValue={props.setValue}
        placeholder={props.placeholderText}
        containerStyle={{ flex: 1 }}
        dropDownContainerStyle={{
          backgroundColor: "white",
          zIndex: 10,
          position: "absolute",
          top: 40,
        }}
        placeholderStyle={{
          color: "gray",
          fontSize: 12,
          fontFamily: "Poppins"
        }}
        textStyle={{
          fontSize: 12,
          color: "black",
          fontFamily: "Poppins"
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  textField: {
    flexDirection: "row",
    justifyContent: 'center',
    alignItems: "center",
    borderBottomColor: Colors.gymme.placeholder,
    borderBottomWidth: 2,
    marginBottom: 8,
    zIndex: 10,
  },
  image: {
    marginHorizontal: 10,
  },
  dropdownPicker: {
    zIndex: 10,
    minHeight: 0,
    paddingHorizontal: 10,
    paddingVertical: 10,
    alignItems: "center",
    fontFamily: "Poppins",
    borderColor: "#fff",
  },
});

export default CustomDropDown;
