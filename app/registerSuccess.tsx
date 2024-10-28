import { Image, StyleSheet, Text, View } from "react-native";
import ButtonCustom from '@/components/button';

export default function registerSuccess() {
    return(
        <View style={styles.baseColor}>
            <View style={styles.mainLayout}>
                <Image style = {styles.successLogo} source = {require('@/assets/images/registerSuccess/success.png')}></Image>
                <Text style={styles.headerText}>Register Success</Text>
                <View style={styles.bottomComponent}>
                    <ButtonCustom width = {258} padding = {15} text = {'Home page'} page = {'/test'}/>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    baseColor:{
        backgroundColor: '#fff',
        flex: 1,
        justifyContent: 'center'
    },
    mainLayout: {
        marginHorizontal: 25,
        marginVertical: 40,
        alignItems: 'center',
        backgroundColor: '#fff',
        flex: 1
    },
    successLogo: {
        marginTop: 100,
        resizeMode: 'contain',
        width: 300,
        height: 300
    },
    headerText: {
        fontSize: 30,
        fontWeight: 'bold',
        fontFamily: 'Poppins'
    },
    bottomComponent: {
        flex: 1,
        justifyContent: "flex-end"
    }
})