import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { options } from "../auth/[...nextauth]/options";
import connetToDatabase from "@/app/lib/db";
import bcrypt from "bcrypt";

export async function POST(req){

    try{

        const session = await getServerSession(options);

        if (!session) {
            return NextResponse.json({ message: "Not authenticated!"}, { status: 401 });
        }

        const passwordData = await req.json();

        const client = await connetToDatabase();
        const usersCollection = client.db().collection('users');
        const foundUser = await usersCollection.findOne({
            email: session.user.email,
        });

        const passwordsAreEqual = await bcrypt.compare(
            passwordData.oldpassword,
            foundUser.password
        );

        if (!passwordsAreEqual) {
            client.close();
            return NextResponse.json({ message: "Invalid password"}, { status: 403 });
        }

        const hashedPassword = await bcrypt.hash(passwordData.newpassword, 12);
        const result = await usersCollection.updateOne(
            { email: foundUser.email },
            { $set: { password: hashedPassword } }
        );

        client.close();
        
        if(!result){
            return NextResponse.json({ message: "Somthing wrong while update"}, { status: 403 });
        } else{
            return NextResponse.json({ message: "Password Changed successsfuly" }, { status: 200 });
        }
      

    } catch (error){
        console.log(error);
        return NextResponse.json(
            { mesaage: "Error!", error},
            { status: 500 },
        );
    }

}