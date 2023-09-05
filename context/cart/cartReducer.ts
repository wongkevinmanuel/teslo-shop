import { ICartProduct } from '../../interfaces';
import { CartState } from './'

type CartActionType = 
| {type: 'Cart-load-from-cookies', payload: ICartProduct[]}
| {type: 'Cart-add-product'};

export const cartReducer = (state: CartState, action: CartActionType): CartState => {
  
switch (action.type) {
    case 'Cart-load-from-cookies':
      return {
        ...state,
     }
    case 'Cart-add-product':
      return {
        ...state,
     }
  
    default:
      return state;
  }

  return state;
}