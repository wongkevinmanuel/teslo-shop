import {FC, useReducer,ReactNode,useEffect} from 'react';
import { ICartProduct } from '../../interfaces';
import CartContext from './CartContext';
import { cartReducer } from './cartReducer';
import Cookie from 'js-cookie';

export interface CartState{
    cart: ICartProduct[];
}

const Cart_ESTADO_INICIAL: CartState = {
    cart: [],
}

interface Props{
    children?: ReactNode;
}

const CartProvider:FC<Props> = ({children}) => {
    //Reducer = una funcion pura (resuelve informacion)
    //basado en argumentos, no interactura con el mundo exterior
    const [state, dispatch] = useReducer(cartReducer,Cart_ESTADO_INICIAL );
    
    //Leer datos de la cookies y recargar el reducer = carrito compras
    useEffect(() => {
        try{
            const cookieCartProduct = Cookie.get('cart') ? JSON.parse(Cookie.get('cart')! ): [];
            dispatch({type:'Cart-load-from-cookies', payload: cookieCartProduct });
        }catch(error){
            dispatch({type:'Cart-load-from-cookies', payload: [] });
        }
    }, [])
    
    
    //Se dispara cuando los productos cambian en el carrito compras
    //Cuando cambie el state.cart se dispara funcion
    //de guardar el carrito de compras en la cookie
    useEffect(() => {
      Cookie.set('cart', JSON.stringify(state.cart));

    }, [state.cart])

    const addProductToCart = (product: ICartProduct) => {
        
        //Se dispara la accion y se modifica el state
        /* Nivel final */
        //si existe el producto en el carrito
        const productInCart = state.cart.some(p => p._id === product._id);
        
        //si no exites un producto, lo agrega
        if ( !productInCart ){
            return dispatch({type:'Cart-update-products', payload: [...state.cart , product] });
        }

        //existe el producto en el carrito, pero si verifica si es la misma talla
        const productInCartButDifferentSize = state.cart.some(p => p._id === product._id && p.size === product.size );
        if(!productInCartButDifferentSize){
            return dispatch({type:'Cart-update-products', payload: [...state.cart, product] });
        }

        //existe el producto con la misma talla 
        //acumular
        const updatedProducts = state.cart.map(
            p=> {
                //producto diferente
                if( p._id !== product._id){ return p; }
                //tallas diferentes
                if( p.size !== product.size){ return p; }
                //acumular actualizar cantidad
                p.quantity += product.quantity;

                return p;
            }); 

        dispatch({type:'Cart-update-products' , payload: updatedProducts });
    };
    
    const removeCartProduct = (product: ICartProduct) => {
        dispatch({type: 'Cart-remove-products', payload: product });
    }

    const updateCartQuantity = (product: ICartProduct) => {
        dispatch({type: 'Cart-update-quantity-products', payload: product});
    }

    return (
        <CartContext.Provider value={{
                ...state,
                //Methos
                addProductToCart,
                updateCartQuantity,
                removeCartProduct 
            }}>
                {children}
        </CartContext.Provider>
     )
}
export default CartProvider;