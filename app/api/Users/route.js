import { NextResponse } from "next/server";
import connetToDatabase from "@/app/lib/db";
import User from "../../(models)/User";
import bcrypt from "bcrypt";

export async function POST(req){

    try{

        const userData = await req.json();

        //confirm data exits
        if (!userData.email || !userData.password){
            return NextResponse.json(
                { mesaage: "All fileds are required"},
                { status: 400 },
            )
        }

        //check for dublicate email
        const client = await connetToDatabase();
        const usersCollection = client.db().collection('users');
        const dublicate = await usersCollection.findOne({email: userData.email});
        //const dublicate = await User.findOne({ email: userData.email}).lean().exec();

        if(dublicate){
            client.close();
            return NextResponse.json(
                { mesaage: "User alreay exits"},
                { status: 409 },
            )
        }
        
        const hashPassword = await bcrypt.hash(userData.password, 12);
        userData.password = hashPassword;

        const db = client.db();
        await db.collection('users').insertOne(userData);
        //await User.create(userData);
        client.close();
        return NextResponse.json({ message: "User registered." }, { status: 201 });
      
    } catch (error){
        console.log(error);
        return NextResponse.json(
            { mesaage: "Error!", error},
            { status: 500 },
        );
    }

}