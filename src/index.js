import * as faker from 'faker'
import React, { useCallback, useState } from 'react'
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Person from './Person'

export default function App() {
  const [people, setPeople] = useState([])
  const createTable = useCallback(async () => {
    await Person.createTable()
    Alert.alert('Table created successfully')
  }, [])

  const createPerson = useCallback(async () => {
    const props = {
      name: faker.name.firstName(),
      age: faker.random.number(80)
    }

    const person = new Person(props)
    await person.save()
    setPeople(await Person.query())
  }, [])

  return (
    <View style={styles.container}>
      <TouchableOpacity style={{ padding: 20 }} onPress={createTable}>
        <Text>Create table</Text>
      </TouchableOpacity>
      <TouchableOpacity style={{ padding: 20 }} onPress={createPerson}>
        <Text>Create person</Text>
      </TouchableOpacity>
      <ScrollView style={{ flex: 1 }}>
        {
          people.map(person => <Text key={person.id}>{JSON.stringify(person)}</Text>)
        }
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40,
  },
});
