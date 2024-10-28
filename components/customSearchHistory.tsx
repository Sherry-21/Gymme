import { Colors } from "@/constants/Colors"
import { Image, Pressable, StyleSheet, Text, View } from "react-native"

const historyImage = require("@/assets/images/search/history.png")
const xImage = require("@/assets/images/search/x.png")

const CustomSearchHistory = (props:any) => {

    const deleteHistory = () => {
        console.log("HAPUS HISTORY")
    }

    return(
        <View style={styles.historyField}>
            <View style={styles.leftItem}>
                <Image style={styles.image} source={historyImage}/>
                <Text style={styles.text}>{props.text}</Text>
            </View>

            <Pressable onPress={deleteHistory}>
                <Image style={styles.xImage} source={xImage}/>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    historyField: {
        flexDirection: 'row',
        borderBottomColor: Colors.gymme.placeholder,
        borderBottomWidth: 2,
        width: '100%',
        flex: 1,
        backgroundColor: Colors.gymme.background,
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5
    },
    image: {
        margin: 10,
        width: 24,
        height: 24,
        resizeMode: 'contain'
    },
    xImage: {
        width: 20,
        height: 20,
        resizeMode: 'contain'
    },
    leftItem: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    text: {
        padding: 10,
        fontSize: 16,
        alignItems: 'center',
        fontFamily: 'Poppins'
    }
})

export default CustomSearchHistory;