import { MongoClient, ServerApiVersion } from "mongodb"

const uri = process.env.MONGODB_URI
const dbName = process.env.MONGODB_DB || "startup-prediction"

if (!uri) {
  throw new Error("Missing MONGODB_URI environment variable")
}

const options = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
}

let client: MongoClient

declare global {
  var _mongoClient: MongoClient | undefined
}

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClient) {
    global._mongoClient = new MongoClient(uri, options)
  }
  client = global._mongoClient
} else {
  client = new MongoClient(uri, options)
}

export async function getDb() {
  await client.connect()
  return client.db(dbName)
}
