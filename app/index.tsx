import { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet, Text, Image, StatusBar } from 'react-native';
import Entypo from '@expo/vector-icons/Entypo';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import LoginTextField from '@/components/customTextField';
import ButtonCustom from '@/components/button';
import { Link } from 'expo-router';
import { Colors } from '@/constants/Colors';

SplashScreen.preventAutoHideAsync();

const lock = require('@/assets/images/login/lock.png');
const emailImage = require('@/assets/images/login/email.png');

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  useEffect(() => {
    async function prepare() {
      try {
        await Font.loadAsync(Entypo.font);
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }
    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  const validateAccount = () => {
    console.log("Belom ada validasi login")
    console.log(email)
  }

  return (
    <View style={styles.baseColor} onLayout={onLayoutRootView}>
      <StatusBar
        barStyle={"dark-content"}
        backgroundColor="white"
        hidden={false}
      />
      <View
        style={styles.mainLayout}>

        <Image style={styles.loginLogo} source={require('@/assets/images/login/login logo.png')} />

        <View style={styles.mainLogin}>
          <Text style={styles.headerText}> Login Screen </Text>
          <LoginTextField placeholderText = {'Email'} image = {emailImage} value = {email} setValue = {setEmail}/>
          <LoginTextField placeholderText = {'Password'} image = {lock} value = {password} setValue = {setPassword} secure = {true}/>
        </View>
        
        <ButtonCustom parent={validateAccount} width = {258} padding = {15} text = {'Login'} page = {'/test'}/>

        <View style={styles.bottomText}>
          <Text>Don’t have an account? </Text>
          <Link href='/register'>
            <Text style={styles.link}>Register here</Text>
          </Link>
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
    backgroundColor: '#fff'
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
