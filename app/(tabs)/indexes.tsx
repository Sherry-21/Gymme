import { Image, StyleSheet, Platform, View, Text, TextInput, ScrollView } from 'react-native';

import NewsButton  from '@/components/homeNews';
import { useEffect, useState } from 'react';
import { Colors } from '@/constants/Colors';

const searchImage = require('@/assets/images/home/search.png')
const dummy = require('@/assets/images/home/dummy img.png')

export default function HomeScreen() {

  const [value, setValue] = useState('');

  useEffect(() => {
    console.log(value);

    return(() => {
      console.log("UNMOUNT");
    })
  })
  return (
  <ScrollView style={styles.baseColor}>
    <Image style={styles.aboveImage} source={require('@/assets/images/news/above image.png')}></Image>
    <View
      style={styles.mainLayout}>
        <View style={styles.textField}>
              <Image style={styles.image} source={searchImage}></Image>
              <TextInput
                  style={styles.textInput}
                  value={value}
                  onChangeText={setValue}
                  placeholder={'Search news'}
                  placeholderTextColor={Colors.gymme.placeholder}
                  underlineColorAndroid="transparent">
              </TextInput>
        </View>

        <NewsButton id={1} image={dummy} title={'5 kesalahan yang sering terjadi saat melakukan gym'} date={'24 agt 2024 (also dummy)'}/>
        <NewsButton image={dummy} title={'5 kesalahan yang sering terjadi saat melakukan gym'} date={'24 agt 2024 (also dummy)'}/>
        <NewsButton image={dummy} title={'5 kesalahan yang sering terjadi saat melakukan gym'} date={'24 agt 2024 (also dummy)'}/>
        <NewsButton image={dummy} title={'5 kesalahan yang sering terjadi saat melakukan gym'} date={'24 agt 2024 (also dummy)'}/>
        <NewsButton image={dummy} title={'5 kesalahan yang sering terjadi saat melakukan gym'} date={'24 agt 2024 (also dummy)'}/>
        <NewsButton image={dummy} title={'5 kesalahan yang sering terjadi saat melakukan gym'} date={'24 agt 2024 (also dummy)'}/>
        <NewsButton image={dummy} title={'5 kesalahan yang sering terjadi saat melakukan gym'} date={'24 agt 2024 (also dummy)'}/>

    </View>
  </ScrollView>


  );
}

const styles = StyleSheet.create({
  aboveImage: {
    flex: 1,
    width: '100%',
    height: 180,
    position: 'absolute'
  },
  baseColor:{
    backgroundColor: '#fff',
    flex: 1,
  },
  mainLayout: {
    marginHorizontal: 25,
    marginVertical: 40,
    alignItems: 'center',
  },
  textField: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 15,
    width: '100%',
    paddingHorizontal: 15,
    paddingVertical: 5,
    flex: 1,
    marginTop: 100,
    backgroundColor: Colors.gymme.background,
    marginBottom: 15
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
  },
  loginLogo: {
    resizeMode: 'contain',
    width: 250,
    height: 250
  },
  mainLogin: {
    marginTop: 25,
    width: '100%',
    marginBottom: 40
  },
  headerText: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 20,
    fontFamily: 'Poppins'
  },
  bottomText: {
    flexDirection: 'row',
    marginTop: 5,
  },
  link: {
    textDecorationLine: 'underline',
    textDecorationColor: Colors.gymme.blue,
    color: Colors.gymme.blue
  }
});