import {FC, useReducer,ReactNode} from 'react';
import { AuthContext, authReducer } from './';
import { IUser } from '../../interfaces';
import tesloApi from '../../api/tesloApi';
import Cookies from 'js-cookie';
import axios from 'axios';

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
              const [state, dispatch] = useReducer(authReducer, AUTH_ESTADO_INICIAL);

    //return un Promise<boolean>, retorna una promesa que resuelve un boolean
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
    
                                                    //tipo de retorno en linea
    const registerUser = async (name:string, email:string, password: string): Promise <{hasError: boolean; message?:string}> =>{
        try{
            const {data} = await tesloApi.post('/user/register', {name, email, password});
            const {token, user } = data;
            Cookies.set('token', token);
            dispatch({type: 'Auth-login', payload: user});
            //TODO: return
            return {
                hasError: false
            };
        }catch(error){
            if(axios.isAxiosError(error)){
                console.log(error.response?.data.message);
                return {
                    hasError: true,
                    message: error.response?.data.message                
                }
            }

            return {
                hasError: true,
                message: 'No se puede crear el usuario'
            }
        }
    }

    return (
               <AuthContext.Provider value={{
                          ...state,
                          //Method
                          loginUser,
                          registerUser
                 }}>
                     {children}
                </AuthContext.Provider>
     )
}