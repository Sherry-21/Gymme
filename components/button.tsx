import { Pressable, StyleSheet, Text } from "react-native"
import { Colors } from '@/constants/Colors';

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
      fontFamily: 'PoppinsBold'
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
  }

  return(
    <Pressable style={styles.button} onPress={movePage}>
      <Text style= {styles.buttonText}>{props.text}</Text>
    </Pressable>
  )
}

export default buttonCustom
