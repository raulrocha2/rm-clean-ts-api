import { Collection, MongoClient } from 'mongodb'

export const MongoHelper = {
  mongoClient: null as MongoClient,
  uri: null as string,

  async connect(uri: string): Promise<void> {
    this.uri = uri
    this.mongoClient = await MongoClient.connect(uri)
  },
  async disconnect(): Promise<void> {
    await this.mongoClient.close()
  },

  async getCollection(name: string): Promise<Collection> {

    if (!this.mongoClient) {
      await this.mongoClient.connect(this.uri)

    }
    return this.mongoClient.db().collection(name)
  },

  map(collection: any): any {
    const { _id, ...objWithoutId } = collection
    return Object.assign({}, objWithoutId, {
      id: _id.toString(),
    })
  }
}