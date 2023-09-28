import {FC, useReducer,ReactNode} from 'react';
import { AuthContext, authReducer } from './';
import { IUser } from '../../interfaces';
import tesloApi from '../../api/tesloApi';
import Cookies from 'js-cookie';

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

    return (
               <AuthContext.Provider value={{
                          ...state,
                          //Method
                          loginUser,
                          //registerUser
                 }}>
                     {children}
                </AuthContext.Provider>
     )
}