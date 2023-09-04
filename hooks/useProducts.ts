import useSWR, { SWRConfiguration } from 'swr'
import { IProduct } from '../interfaces';

//Se uso otro modo
//const fetcher = ( ...args:[key:string] ) => fetch(...args ).then(res => res.json());

export const useProducts = (url:string, config: SWRConfiguration = {}) =>{
    //const {data , error } =  useSWR<IProduct[]>(`/api${ url }`, fetcher, config);
    const {data , error } =  useSWR<IProduct[]>(`/api${ url }`, config);
    
    return {
        //Si no existen productos es = arreglo vacion []f
        products: data || [ ],
        // isLoading solo se tendra cuando si no hay ningun error
        // y tampoco hay data es igual a Loading
        isLoading: !error && !data,
        isError: error
    }
}