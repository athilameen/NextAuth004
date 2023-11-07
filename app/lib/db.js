import { MongoClient } from "mongodb"

async function connetToDatabase() {

    const connectString = process.env.MONGODB_URI;

    try {
        const client = await MongoClient.connect(connectString);
        return client;
    } catch (error) {
        return error;
    }
  
}

export default connetToDatabase;