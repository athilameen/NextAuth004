import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import User from "@/app/(models)/User";
import { MongoClient } from "mongodb"

export const options = {
  providers: [
    GitHubProvider({
      profile(profile) {
        console.log("Profle GitHub ", profile);

        let userRole = "GitHub User";
        if (profile?.email == "athilammeen@gmail.com") {
          userRole = "admin";
        }

        return {
          ...profile,
          role: userRole,
        };
      },
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_Secret,
    }),
    GoogleProvider({
      profile(profile) {
        console.log("Profle Google ", profile);

        let userRole = "Google User";

        return {
          ...profile,
          id: profile.sub,
          role: userRole,
        };
      },
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_Secret,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials : {
        email : {
          label: "Email",
          type: "text",
          placeholder: "Your Email",
        },
        password : {
          label: "Pasword",
          type: "password",
          placeholder: "Your Password",
        },
      },
      async authorize(credentials){

          try{

            //const foundUser = await User.findOne({ email: credentials.email});
            const client = await MongoClient.connect(process.env.MONGODB_URI);
            const usersCollection = client.db().collection('users');
    
            const foundUser = await usersCollection.findOne({
              email: credentials.email,
            });

            
            if(foundUser){

              console.log('User Exists');
              const match = await bcrypt.compare(
                credentials.password,
                foundUser.password
              );
              
              if(match){
                console.log('Good Pass');
                delete foundUser.password;
                foundUser['role'] = 'Unveried Email';
                client.close();
                return foundUser;
              }

            }
          } catch (error){
            console.log(error);
          }

          client.close();
          return null;
      },
    }),
  ],
  callbacks : {
    async jwt({token, user}) {
        if(user) token.role = user.role;
        return token;
    },
    async session({session, token}) {
        if(session?.user) session.user.role = token.role;
        return session;
    }
  }
};
