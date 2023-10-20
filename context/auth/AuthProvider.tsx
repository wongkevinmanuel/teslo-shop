import {FC, useReducer,ReactNode, useEffect} from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Cookies from 'js-cookie';

import { AuthContext, authReducer } from './';
import { IUser } from '../../interfaces';
import tesloApi from '../../api/tesloApi';

import { useSession, signIn, signOut } from "next-auth/react"

//Estado de la informacion que se maneja
export interface AuthState{
    isLoggedIn: boolean;
    user?: IUser;
}

const AUTH_ESTADO_INICIAL: AuthState = {
    isLoggedIn: false,
    user: undefined
}

interface Props{
          children?: ReactNode;
}

export const AuthProvider:FC<Props> = ({children}) => {
    
    //Session
    const {data: session, status } = useSession();
    
    //Autenticacion basada en nextAuth
    useEffect(()=> {
        if( status === 'authenticated'){
            console.log(session?.user);
            dispatch ({type: 'Auth-login', payload: session?.user as IUser});
        }
    }, [status, session ])

    const [state, dispatch] = useReducer(authReducer, AUTH_ESTADO_INICIAL);
    
    //Se dispara una unica vez/ no dependencias
    //para 
    //useEffect(()=> { checkToken() }, [])

    //const checkToken = async ()=> {
    //    if (!Cookies.get('token'))
    //        return;
    //try{
    //        const { data} = await tesloApi.get('/user/validatetoken');
    //        const { token, user } = data;
    //        Cookies.set('token', token);
    //        dispatch({type: 'Auth-login', payload: user});
    //   }catch(error){
    //        Cookies.remove('token');
    //    }
    //}

    //devuelve una Promise<boolean>, retorna una promesa que resuelve un boolean
    
    const loginUser = async (email:string, password: string): Promise<boolean> =>{
        try{
            const {data} = await tesloApi.post('/user/login', {email, password});
            const {token, user } = data;
            Cookies.set('token', token);

            dispatch({type: 'Auth-login', payload: user});
            
            return true;
        }catch(error){
            return false;
        }
    }
    
    const router = useRouter();

    const onLogOut = ()=>{
        Cookies.remove('user');
        Cookies.remove('cart');
        //Direccion del usuario
        Cookies.remove('firstName');
        Cookies.remove('lastName');
        Cookies.remove('address');
        Cookies.remove('address2');
        Cookies.remove('zip');
        Cookies.remove('city');
        Cookies.remove('country');
        Cookies.remove('phone');
        
        signOut();
        //refresh app = perder el estado app
        //router.reload();
        //Cookies.remove('token');
        
        
    }
    
                                                    //tipo de retorno en linea
    const registerUser = async (name:string, email:string, password: string)
                    : Promise <{hasError: boolean; message?:string}> =>{
        try{
            const {data} = await tesloApi.post('/user/register', {name, email, password});
            const {token, user } = data;
            Cookies.set('token', token);
            dispatch({type: 'Auth-login', payload: user});
            return {
                hasError: false
            }
        }catch(error){
            if(axios.isAxiosError(error)){
                return {
                    hasError: true,
                    message: error.response?.data.message                
                }
            }

            return {
                hasError: true,
                message: 'No se pudo crear el usuario.'
            }
        }
    }

    return (
        <AuthContext.Provider value={{
                    ...state,
                    //Method
                    loginUser,
                    onLogOut,
                    registerUser,
            }}>
                {children}
        </AuthContext.Provider>
     )
}