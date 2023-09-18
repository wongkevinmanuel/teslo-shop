import {createContext} from 'react';
import { ICartProduct } from '../../interfaces';

interface ContextProps {
    cart: ICartProduct[],

    numberOfItems: 0,
    subTotal: 0,
    tax: 0,
    total:0
    //numberOfItems: number,
    //subTotal: number,

    //Metodos
    addProductToCart: (product: ICartProduct) => void;
    updateCartQuantity: (product: ICartProduct) => void;
    removeCartProduct:(product: ICartProduct) => void;
}

 const CartContext = createContext({} as ContextProps);

 export default CartContext;