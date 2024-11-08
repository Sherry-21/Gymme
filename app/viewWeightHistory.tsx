import React, {useState} from 'react'
import {FlatList, ScrollView, StyleSheet, Text, Touchable, TouchableOpacity, View} from "react-native";
import Items from "ajv/lib/vocabularies/applicator/items";
//make component
const WeightEntry = ({weight,date}:{weight:string,date:string}) =>{
        return <View style={styles.entryContainer}>
            <Text style={styles.icon}>🏋️‍♂️</Text>
            <View style={styles.detail}>
                <Text style={styles.Weight}>{weight} Kg</Text>
                <Text style={styles.Date}>{date}</Text>
            </View>
        </View>
}
const viewWeightHistory = () =>{
    const [historyData,SetHistoryData] = useState([
        {id:1,weight:'50',date:'19 Nov 2024'},
        {id:2,weight:'50',date:'19 Nov 2024'},
        {id:3,weight:'50',date:'19 Nov 2024'},
        {id:4,weight:'50',date:'19 Nov 2024'},
        {id:5,weight:'50',date:'19 Nov 2024'},
    ]);

    const onPressLoader = () =>{
        var lastWeight = historyData.at(-1)
        var constNewId = lastWeight ? lastWeight.id+1:1
        var Obj = {id:constNewId,weight:'50',date:'19 Nov 2024'}
        // setPerson(person.concat({sysno: newSysno,weight:'50',date:'18 Nov 2023',das:['123','2','2']}))
        SetHistoryData([...historyData,Obj])
    }
    return (
      <ScrollView>
          <FlatList data={historyData}
                    renderItem={({item})=>(
                        <TouchableOpacity onPress={onPressLoader}>
                        <View>
                        <WeightEntry weight={item.weight} date={item.date}/>
                        <View style={styles.divider} />
                        </View>
                        </TouchableOpacity>
                    )}/>
      </ScrollView>
    );
}

const styles = StyleSheet.create({
    entryContainer: {
        flexDirection:'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 20,
        // width:'100%'
    },
    icon:{
        fontSize:40,
        marginRight:10
    },
    detail:{
        flex: 1,
        flexDirection:'row',
        justifyContent:'space-between',
    },
    Weight:{
        marginLeft:10,
        fontSize:20,
        fontWeight:'bold'
    },
    Date:{
        marginRight:15,
        fontSize:18,
        color:'#666'
    },
    divider:{
        height: 1,
        backgroundColor: '#ddd',
        marginHorizontal: 20,
    },
})

export default viewWeightHistory