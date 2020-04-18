import * as  SQLite from 'expo-sqlite'
import { BaseModel, types } from 'expo-sqlite-orm'

export default class Person extends BaseModel {
  constructor(obj) {
    super(obj)
  }

  static get database() {
    return async () => SQLite.openDatabase('people.db')
  }

  static get tableName() {
    return 'people'
  }

  static get columnMapping() {
    return {
      id: { type: types.INTEGER, primary_key: true },
      name: { type: types.TEXT, not_null: true },
      age: { type: types.NUMERIC },
      timestamp: { type: types.INTEGER, default: () => Date.now() }
    }
  }
}