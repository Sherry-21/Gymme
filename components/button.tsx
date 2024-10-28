import { Pressable, StyleSheet, Text, TouchableOpacity } from "react-native"
import { Colors } from '@/constants/Colors';
import { router } from "expo-router";

const buttonCustom = (props:any) => {
  const styles = StyleSheet.create({
    button: {
      width: props.width,
      alignItems: 'center',
      padding: props.padding,
      backgroundColor: Colors.gymme.orange,
      borderTopRightRadius: 15,
      borderTopLeftRadius: 15,
      borderBottomLeftRadius: 15,
      borderBottomRightRadius: 15,
    },
    buttonText: {
      fontWeight: 'bold',
      fontFamily: 'Poppins'
    }
  })

  const movePage = () => {
    //call parent function to call validate method in parent (if exists)
    try{
      props.parent()
    }
    catch(e){
      console.log("Parent don't have any inherit function");
    }

    //move to other page
    if(props.page != null) {
      router.push({ pathname: props.page});
    }
  }

  return(
    <Pressable style={styles.button} onPress={movePage}>
      <Text style= {styles.buttonText}>{props.text}</Text>
    </Pressable>
  )
}

export default buttonCustom
