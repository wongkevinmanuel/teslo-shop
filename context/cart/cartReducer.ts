import { ICartProduct } from '../../interfaces';
import { CartState, ShippingAddress } from './'

//nombre accion y q dato espera
type CartActionType = 
| {type: 'Cart-load-from-cookies', payload: ICartProduct[]}
| {type: 'Cart-update-products' , payload: ICartProduct[] }
//regresa todo el ICartProduct = nuevo producto con nueva cantidad
| {type: 'Cart-update-quantity-products' , payload: ICartProduct }
| {type: 'Cart-remove-products' , payload: ICartProduct }
//Address
| {type: 'Address-load-from-cookies' , payload: ShippingAddress }
| {type: 'Cart-update-order-summary' , 
  payload: {
    numberOfItems: number;
    subTotal: number;
    tax: number;
    total: number
  }};

//1. En el reducer no ejecutar codigo de terceros.
//2. No ejecutar un codigo, que salga del alcancce de la funcion.
//3. No disparar efectos secundarios dentro del reducer.
export const cartReducer = (state: CartState, action: CartActionType): CartState => {
  
switch (action.type) {
    case 'Cart-load-from-cookies':
      return {
        ...state,
        isLoaded: true,
        cart: [...action.payload],
    }
     
    case 'Cart-update-products':
      return {
        ...state,
        cart: [...action.payload],
      };

    case 'Cart-update-quantity-products':
      return {
        ...state, //mantener el estado
        cart: state.cart.map(product => {
          if( product._id !== action.payload._id) return product;
          if( product.size !== action.payload.size) return product;
          
          //actualizar la cantidad
          const quantity = action.payload.quantity;
          product.quantity = quantity;
          return product;
          
          // funciona tambien, el payload tiene el producto ya actualizado
          //return action.payload;
        })
      }; 
      case 'Cart-remove-products':
        return {
          ...state, //estado sin producto
          cart: state.cart.filter(p => !(p._id === action.payload._id && 
                                  p.size === action.payload.size) )
          //other way
          //cart: state.cart.filter(p => {
          // if(product._id === action.payload._id){ 
          //    if(product.size === action.payload.size) return false;
          //  }
          //return true;
        }
        case 'Cart-update-order-summary':
          return {
            ...state,
            ...action.payload
        }
        case 'Address-load-from-cookies':
          return {
            ...state,
            shippingAddress : action.payload
          }

    default:
      return state;
  }
}