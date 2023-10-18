import NextAuth from 'next-auth'
import GithubProvider from 'next-auth/providers/github'
import CredentialsProvider from "next-auth/providers/credentials"

export  const authOptions = {
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID ,
      clientSecret: process.env.GITHUB_SECRET ,
    }),
    CredentialsProvider({
      name:'Custom login',
      credentials: {
        email: { label: "Correo", type:"email", placeholder:"tucorreo@google.com"},
        password: { label: "Contraseña", type: "password", placeholder:"XXXXXX"}
      },
      async authorize(credentials, req){
        console.log({credentials});
        return null;
      }
    })
  ],
  callbacks:{
    
  }

}

export default NextAuth(authOptions)