import {createContext} from 'react';
import { ICartProduct } from '../../interfaces';

interface ContextProps {
    cart: ICartProduct[],
    
    //Metodos
    addProductToCart: (product: ICartProduct) => void;
}

 const CartContext = createContext({} as ContextProps);

 export default CartContext;