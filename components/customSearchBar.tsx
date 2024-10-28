import { Colors } from "@/constants/Colors";
import { Image, StyleSheet, TextInput, View } from "react-native";


const CustomSearchBar = (props:any) => {
    return (
        <View style={styles.textField}>
            <Image style={styles.image} source={props.image}></Image>
            <TextInput
                style={styles.textInput}
                value={props.value}
                onChangeText={props.setValue}
                placeholder={props.placeholderText}
                placeholderTextColor={Colors.gymme.placeholder}
                underlineColorAndroid="transparent">
            </TextInput>
        </View>
    );
}

const styles = StyleSheet.create({
    textField: {
        flexDirection: 'row',
        borderWidth: 2,
        borderRadius: 15,
        width: '100%',
        paddingHorizontal: 15,
        paddingVertical: 10,
        flex: 1,
        backgroundColor: Colors.gymme.background
    },
    image: {
        margin: 10,
        width: 24,
        height: 24,
        resizeMode: 'contain'
    },
    textInput: {
        padding: 10,
        fontSize: 14,
        alignItems: 'center',
        fontFamily: 'Poppins',
        width: '100%'
    }
})

export default CustomSearchBar;