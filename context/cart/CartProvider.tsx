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

    const addProductToCart = (product: ICartProduct) =>{
        //Se dispara la accion y se modifica el state
        /* Nivel final */
        //si existe el producto en el carrito
        const productInCart = state.cart.some(p => p._id === product._id);
        //si no exites un producto, lo agrega
        if (!productInCart ) return dispatch({type:'Cart-update-products', payload: [...state.cart, product] });
        //existe el producto en el carrito, pero si verifica si es la misma talla
        const productInCartButDifferentSize = state.cart.some(p => p._id === product._id && p.size === product.size );
        if(!productInCartButDifferentSize)
        return dispatch({type:'Cart-update-products', payload: [...state.cart, product] });
        
        //existe el producto con la misma talla 
        //acumular
        const updatedProducts = state.cart.map(
            p=> {
                //producto diferente
                if( p._id !== product._id) return p;
                //tallas diferentes
                if( p.size !== product.size) return p;
                //acumular actualizar cantidad
                p.quantity += product.quantity;
                return p;
            }
        );

        dispatch({type:'Cart-update-products', payload: updatedProducts });

    } 
    return (
            <CartContext.Provider value={{
                    ...state,
                    //Methos
                    addProductToCart, 
                }}>
                    {children}
            </CartContext.Provider>
     )
}