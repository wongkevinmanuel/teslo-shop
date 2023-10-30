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
    
    updateAddress: (address: ShippingAddress) => void;

    //Orders
    createOrder: () => Promise<{hasError: boolean, message: string }>;
}

 const CartContext = createContext({} as ContextProps);

 export default CartContext;