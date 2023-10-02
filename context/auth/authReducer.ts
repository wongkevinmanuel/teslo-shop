import { IUser } from '../../interfaces';
import { AuthState } from './'

type AuthActionType = 
| {type: 'Auth-login', payload: IUser}
| {type: 'Auth-logout'};

export const authReducer = (state: AuthState, action: AuthActionType): AuthState => {
  
switch (action.type) {
    case 'Auth-login':
      return {
        ...state,
        isLoggedIn:true,
        user: action.payload
     }
     case 'Auth-logout':
        return {
            ...state,
            isLoggedIn: false,
            user: undefined
        }
      
    default:
      return state;
  }

  return state;
}