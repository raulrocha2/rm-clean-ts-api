import { Collection, MongoClient } from 'mongodb'
import { IAccountModel } from '../../../../domain/models/Account'

export const MongoHelper = {
  mongoClient: null as MongoClient,

  async connect(uri: string): Promise<void> {
    this.mongoClient = await MongoClient.connect(uri)
  },
  async disconnect(): Promise<void> {
    await this.mongoClient.close()
  },

  getCollection(name: string): Collection {
    return this.mongoClient.db().collection(name)
  },

  map(collection: any): any {
    const { _id, ...objWithoutId } = collection
    return Object.assign({}, objWithoutId, {
      id: _id.toString(),
    })
  }
}