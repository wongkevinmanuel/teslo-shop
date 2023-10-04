import {createContext} from 'react';
import { ICartProduct } from '../../interfaces';

interface ContextProps {
    cart: ICartProduct[],

    numberOfItems: number,
    subTotal: number,
    tax: number,
    total: number
    //numberOfItems: number,
    //subTotal: number,

    //Metodos
    addProductToCart: (product: ICartProduct) => void;
    updateCartQuantity: (product: ICartProduct) => void;
    removeCartProduct:(product: ICartProduct) => void;
}

 const CartContext = createContext({} as ContextProps);

 export default CartContext;