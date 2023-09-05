import { IProduct } from "../interfaces";
import { Product } from "../models";
import { db } from './';


export const getProductBySlug = async(slug: string): 
                                    Promise<IProduct | null>=>{
    
    await db.connect();
    //.lean para traer un objeto liegero mongo (sin metodos)
    const product = await Product.findOne({slug}).lean();
    await db.disconnect();
    
    if(!product ){
        return null;
    }
    //forzar al objeto de que sea serializado como string
    return JSON.parse( JSON.stringify (product ) );
}

interface ProductSlug{
    slug: string;
}

export const getAllProductSlugs = async(): Promise <ProductSlug[]>  => {
    await db.connect();
    
    const slugs = await Product.find().select('slug -_id').lean();
    
    await db.disconnect();

    return slugs;
}

//return Promise or null
//return por defecto de una function es undefined
export const getProductByTerm = async(term: string): 
                                    Promise<IProduct[]> =>{
    term = term.toString().toLowerCase();

    await db.connect();
    //.lean para traer un objeto liegero mongo (sin metodos)
    // TODO: formas de buscar ???
    const products = await Product.find(
        { $text: { $search: term} })
        .select('title images price inStock slug -_id')
        .lean();
    
    await db.disconnect();
    return products;
}

export const getAllProducts = async() : Promise<IProduct[] > => {    
//export const getAllProducts = async() : Promise<IProduct[] | null> => {  
    await db.connect();
    const products = await Product.find().select('title images price inStock slug -_id').lean();
    await db.disconnect();
    
    return products;

    /* OTRA MANERA
    await db.connect();
    const products = await Product.find().lean();
    await db.disconnect();
    //forzar al objeto de que sea serializado como string
    return JSON.parse( JSON.stringify (product ) );
    */
}