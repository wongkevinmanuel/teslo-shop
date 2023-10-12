import {createContext} from 'react';
import { ICartProduct } from '../../interfaces';
import { ShippingAddress } from './';

interface ContextProps {
    
    isLoaded: boolean;
    cart: ICartProduct[];
    numberOfItems: number;
    subTotal: number;
    tax: number;
    total: number;

    shippingAddress?: ShippingAddress,

    //Metodos
    addProductToCart: (product: ICartProduct) => void;
    updateCartQuantity: (product: ICartProduct) => void;
    removeCartProduct:(product: ICartProduct) => void;
}

 const CartContext = createContext({} as ContextProps);

 export default CartContext;