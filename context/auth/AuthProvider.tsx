import {FC, useReducer,ReactNode} from 'react';
import { AuthContext, authReducer } from './';
import { IUser } from '../../interfaces';

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

    return (
               <AuthContext.Provider value={{
                          ...state
                          //Method
                 }}>
                     {children}
                </AuthContext.Provider>
     )
}