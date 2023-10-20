import NextAuth from 'next-auth'
import GithubProvider from 'next-auth/providers/github'
import CredentialsProvider from "next-auth/providers/credentials"
import { dbUsers } from '../../../database';

export  const authOptions = {
  // Configure one or more authentication providers
  // callbacks: Las devoluciones de llamada son 
  //funciones asincrónicas que puedes utilizar 
  //para controlar lo que sucede cuando se realiza 
  //una acción.
  providers: [
    CredentialsProvider({
      name:'Custom login',
      credentials: {
        email: { label: "Correo", type:"email", placeholder:"tucorreo@google.com"},
        password: { label: "Contraseña", type: "password", placeholder:"XXXXXX"},
      },

      async authorize(credentials, req){
        console.log({credentials});
        return await dbUsers.checkUser(credentials!.email,credentials!.password);
      }
    }),

    GithubProvider({
      clientId: process.env.GITHUB_ID ,
      clientSecret: process.env.GITHUB_SECRET ,
    }),
  ],

  callbacks:{
    //Cuando se genera un json web token
    async jwt({token, account, user}){
      //Conserve el token de acceso de OAuth o 
      //la identificación de usuario en el token 
      //justo después de iniciar sesión
      if (account){
        token.accessToken = account.access_token;
        
        switch( account.type){
          case 'oauth':
            //TODO: crear usuario o verificar si existe en BD
          break;
          case 'credentials':
            //Crear usuario
            token.user = user;
          break;
        }
      }

      return token;
    },
    //Cuando se cree una session del token
    async session({session, token, user}){
      //Del token se lee el usuario y se establece en la session
      session.accessToken = token.accessToken;
      session.user = token.user as any;

      return session;
      
    }

  }

}

export default NextAuth(authOptions)