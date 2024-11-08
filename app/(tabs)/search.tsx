import CustomSearchHistory from "@/components/customSearchHistory";
import { Colors } from "@/constants/Colors";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Image, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { searchResultHelper } from "@/helper/pathUtils";

const searchImage = require('@/assets/images/search/search.png')
const aiImage = require('@/assets/images/search/aiImage.png')

export default function SearchScreen() {
    const [value, setValue] = useState('');

    useEffect(() => {
        console.log(value);
    
        return(() => {
          console.log("UNMOUNT");
        })
    })

    const aiLens = () => {
        router.push("/aiLens")
    }

    const handleSubmit = () => {
        router.push(searchResultHelper({path:"searchResult", name:"mock"}) as any)
    }

    return(
        <SafeAreaView style={styles.saveArea}>
            <ScrollView style={styles.mainLayout}>
                <View style={styles.container}>
                    <View style={styles.textField}>
                        <Image style={styles.searchImage} source={searchImage}></Image>
                        <TextInput
                            style={styles.textInput}
                            value={value}
                            onChangeText={setValue}
                            placeholder={'Enter equipment name'}
                            placeholderTextColor={Colors.gymme.placeholder}
                            onSubmitEditing={handleSubmit}
                            underlineColorAndroid="transparent">
                        </TextInput>
                    </View>
                    <Pressable onPress={aiLens}>
                        <Image style={styles.aiImage} source={aiImage}></Image>
                    </Pressable>
                </View>

                <View style={styles.historyContainer}>
                    <Text style={styles.headerSearch}>
                        Recent Search
                    </Text>

                    <CustomSearchHistory text={'Barbel'}/>
                    <CustomSearchHistory text={'Barbel'}/>
                    <CustomSearchHistory text={'Barbel'}/>
                    <CustomSearchHistory text={'test bae'}/>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    saveArea: {
        flex: 1,
        backgroundColor: Colors.gymme.background
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    mainLayout: {
        marginHorizontal: 25,
        marginVertical: 40,
        
    },
    textField: {
        paddingHorizontal: 15,
        paddingVertical: 5,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 15,
        borderWidth: 1,
        width: '80%'
    },
    searchImage: {
        width: 24, 
        height: 24,
        marginRight: 10
    },
    textInput: {
        fontFamily: 'Poppins',
        flex: 1,
        padding: 10,

    },
    aiImage: {
        width: 45, 
        height: 45
    },
    headerSearch: {
        marginTop: 5,
        fontSize: 20,
        fontWeight: 'bold',
        fontFamily: 'Poppins'
    },
    historyContainer: {
        marginTop: 15,
    }
})