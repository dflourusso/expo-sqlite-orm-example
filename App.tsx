import { ColumnMapping, columnTypes, IStatement, Migrations, Repository, sql } from 'expo-sqlite-orm'
import React, { useMemo, useState } from 'react'
import { Platform, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native'

interface Animal {
  id: number
  name: string
  color: string
  age: number
  another_uid?: number
  timestamp?: number
}

const columMapping: ColumnMapping<Animal> = {
  id: { type: columnTypes.INTEGER },
  name: { type: columnTypes.TEXT },
  color: { type: columnTypes.TEXT },
  age: { type: columnTypes.NUMERIC },
  another_uid: { type: columnTypes.INTEGER },
  timestamp: { type: columnTypes.INTEGER, default: () => Date.now() },
}

const statements: IStatement = {
  '1662689376195_create_animals': sql`
        CREATE TABLE animals (
          id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          color TEXT,
          age NUMERIC,
          another_uid TEXT UNIQUE,
          timestamp INTEGER
        );`,
}

const databaseName = 'dbName'

export default function MeusServicosScreen() {
  const [animals, setAnimals] = useState<Animal[]>([])
  const migrations = useMemo(() => new Migrations(databaseName, statements), [])

  const animalRepository = useMemo(() => {
    return new Repository(databaseName, 'animals', columMapping)
  }, [])

  const onPressRunMigrations = async () => {
    await migrations.migrate()
  }

  const onPressReset = async () => {
    await migrations.reset()
    setAnimals([])
  }

  const onPressInsert = () => {
    animalRepository.insert({ name: 'Bob', color: 'Brown', age: 2 }).then((createdAnimal) => {
      console.log(createdAnimal)
    })
  }

  const onPressQuery = () => {
    animalRepository.query({ where: { age: { gte: 1 } } }).then((foundAnimals) => {
      console.log(foundAnimals)
      setAnimals(foundAnimals)
    })
  }

  if (Platform.OS === 'web') {
    return <View style={styles.container}>
      <Text>Not supported in web platform</Text>
    </View>
  }

  return (
    <SafeAreaView>
      <ScrollView>
        <Text onPress={onPressRunMigrations}>
          Migrate
        </Text>
        <Text onPress={onPressReset}>
          Reset Database
        </Text>
        <Text onPress={onPressInsert}>
          Insert Animal
        </Text>
        <Text onPress={onPressQuery}>
          List Animals
        </Text>
        <Text>{JSON.stringify(animals, null, 1)}</Text>
      </ScrollView>
    </SafeAreaView>
  )
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