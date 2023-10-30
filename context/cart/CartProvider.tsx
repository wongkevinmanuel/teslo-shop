import {FC, useReducer,ReactNode,useEffect} from 'react';
import Cookie from 'js-cookie';

import { ICartProduct, IOrder } from '../../interfaces';

import CartContext from './CartContext';
import { cartReducer } from './cartReducer'; 
import tesloApi from '../../api/tesloApi';
import axios from 'axios';

export interface CartState{
    isLoaded: boolean,
    cart: ICartProduct[],
    numberOfItems: number,
    subTotal: number,
    tax: number,
    total: number

    shippingAddress?: ShippingAddress;
}

//ADDRESS
export interface ShippingAddress{
    firstName: string,
    lastName: string,
    address: string,
    address2: string,
    zip: string,
    city: string,
    country: string,
    phone: string
}

const Cart_ESTADO_INICIAL: CartState = {
    isLoaded: false,
    cart: [],
    numberOfItems: 0.0 ,
    subTotal: 0.0 ,
    tax: 0.0 ,
    total: 0.0 ,
    shippingAddress: undefined
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
    
    //Cargar Address en context
    useEffect(() => {
       if(Cookie.get('firstName')){
        //Leer datos de la cookies y recargar el reducer = address
        const shippingAddress = {
            firstName:  Cookie.get('firstName')   || '',
            lastName:   Cookie.get('lastName')    || '',
            address:    Cookie.get('address')     || '',
            address2:   Cookie.get('address2')    || '',
            zip:        Cookie.get('zip')         || '',
            city:       Cookie.get('city')        || '',
            country:    Cookie.get('country')     || '',
            phone:      Cookie.get('phone',  )     || '', 
           };
           dispatch({type:'Address-load-from-cookies', payload: shippingAddress});
       }
    }, [])
    
    //Se dispara cuando los productos cambian en el carrito compras
    //Cuando cambie el state.cart se dispara funcion
    //de guardar el carrito de compras en la cookie
    useEffect(() => {
      Cookie.set('cart', JSON.stringify(state.cart));
    }, [state.cart])


    //cuando cambian los productos se dispara
    //maneja numero de items, total a pagar
    useEffect(
        () => {
            //total de items
            const numberOfItems = state.cart.reduce( (previo, actual) => actual.quantity + previo, 0 );
            const subTotal = state.cart.reduce( (previo, actual) => (actual.price * actual.quantity) + previo, 0 );
            const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE || 0);

            const orderSummary = {
                numberOfItems,
                subTotal,
                tax : subTotal * taxRate,
                total: subTotal  * ( taxRate + 1)
            }
            
            dispatch({type:'Cart-update-order-summary', payload: orderSummary});
        }, [state.cart]
    );

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

    //Address establecer cookiess
    const updateAddress = (address: ShippingAddress) => {
        Cookie.set('firstName', address.firstName);
        Cookie.set('lastName', address.lastName);
        Cookie.set('address', address.address);
        Cookie.set('address2', address.address2);
        Cookie.set('zip', address.zip);
        Cookie.set('city', address.city);
        Cookie.set('country', address.country);
        Cookie.set('phone', address.phone);

        dispatch({type:'Address-update', payload: address});
    }

    const createOrder = async (): Promise<{hasError: boolean, message: string }> => {
        if(!state.shippingAddress){
            throw new Error('No hay direccion de entrega');
        }

        //Size en carrito es opcional.
        //Type 'ISize | undefined' is not assignable to type 'ISize'.
        //Se exparse las proiedades y se modifica la
        //necesaria
        const body: IOrder = {
            orderItems: state.cart.map(p=> ({
                ...p,
                size: p.size! })
            ),

            shippingAddress: state.shippingAddress,
            numberOfItems: state.numberOfItems,

            subTotal: state.subTotal,
            tax: state.tax,
            total: state.total,
            isPaid: false
        }

        try{
            const { data } = await tesloApi.post<IOrder>('/orders',body);
            //TODO: Dispatch

            return {
                hasError: false,
                message: data._id!
            }
        }catch(error){
            if(axios.isAxiosError(error)){
                return{
                    hasError: true,
                    message: error.response?.data.message
                }
            }
            return{
                hasError: true,
                message: 'Error no controlado, llamar al administrador.'
            }
        }
    }

    return (
        <CartContext.Provider value={{
                ...state,
                //Methos
                addProductToCart,
                updateCartQuantity,
                removeCartProduct, 
                updateAddress,
                
                //Orders
                createOrder,
                }}>

                {children}
        </CartContext.Provider>
     )
}

export default CartProvider;