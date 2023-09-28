import {createContext} from 'react';
import { IUser } from '../../interfaces';

//los componentes hijos pueden ver
interface ContextProps {
    isLoggedIn: boolean;
    user?: IUser;
    role?: string;

    loginUser: (email:string, password:string) => Promise<boolean>;
}

export const AuthContext = createContext({} as ContextProps);