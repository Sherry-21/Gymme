import { Image, SafeAreaView, StyleSheet, Text, View } from "react-native";
import ButtonCustom from '@/components/button';
import { router } from "expo-router";

export default function registerSuccess() {
    const moveToNewsPage = () => {
        router.push('/article')
    }

    return(
        <SafeAreaView style={styles.baseColor}>
            <View style={styles.mainLayout}>
                <Image style = {styles.successLogo} source = {require('@/assets/images/registerSuccess/success.png')}></Image>
                <Text style={styles.headerText}>Register Success</Text>
                <View style={styles.bottomComponent}>
                    <ButtonCustom width = {258} padding = {15} text = {'Home page'} parent={moveToNewsPage}/>
                </View>
            </View>
        </SafeAreaView>
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
        marginTop: 70,
        resizeMode: 'contain',
        width: 280,
        height: 280
    },
    headerText: {
        fontSize: 28,
        fontFamily: 'PoppinsBold'
    },
    bottomComponent: {
        flex: 1,
        justifyContent: "flex-end"
    }
})