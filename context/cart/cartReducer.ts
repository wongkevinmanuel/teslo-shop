import { ICartProduct } from '../../interfaces';
import { CartState } from './'

//nombre accion y q dato espera
type CartActionType = 
| {type: 'Cart-load-from-cookies', payload: ICartProduct[]}
| {type: 'Cart-update-products' , payload: ICartProduct[] };

//1. En el reducer no ejecutar codigo de terceros.
//2. No ejecutar un codigo, que salga del alcancce de la funcion.
//3. No disparar efectos secundarios dentro del reducer.
export const cartReducer = (state: CartState, action: CartActionType): CartState => {
  
switch (action.type) {
    case 'Cart-load-from-cookies':
      return {
        ...state,
        cart: [...action.payload],
     }
     
    case 'Cart-update-products':
      return {
        ...state,
        cart: [...action.payload],
      }; 

    default:
      return state;
  }
}