import {FC, useReducer,ReactNode} from 'react';
import { ICartProduct } from '../../interfaces';
import { CartContext, cartReducer } from './';

export interface CartState{
    cart: ICartProduct[];
}

const Cart_ESTADO_INICIAL: CartState = {
      cart: [],
}

interface Props{
          children?: ReactNode;
}

export const CartProvider:FC<Props> = ({children}) => {
              const [state, dispatch] = useReducer(cartReducer, Cart_ESTADO_INICIAL);

    return (
               <CartContext.Provider value={{
                        ...state
                 }}>
                     {children}
                </CartContext.Provider>
     )
}