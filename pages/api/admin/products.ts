import type { NextApiRequest, NextApiResponse } from 'next'
import { IProduct } from '../../../interfaces'
import { db } from '../../../database';
import { Product } from '../../../models';
import { isValidObjectId } from 'mongoose';

type Data = 
|{  message: string }
| IProduct[]
| IProduct

export default function (req: NextApiRequest, res: NextApiResponse<Data>) {
    
    switch (req.method) {
        case 'GET':
            return getProducts(req, res);
        case 'POST':
            return createProduct(req, res );
        case 'PUT':
            return updateProduct(req, res);
    
        default:
            return res.status(400).json({ message: 'Bad request' });
    }
}

const getProducts = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    
    await db.connect();
    const products = await Product.find()
        .sort({title: 'asc'})
        .lean();

    await db.disconnect();
    
    //TODO: host de imagenes cambiar
    //const updatedProducts = products.map();

    if(!products)
        res.status(400).json({message: 'Error al buscar todos los productos'});

    res.status(200).json(products);
}

const createProduct= async (req: NextApiRequest, res: NextApiResponse<Data> )=> {
    
    //Metodos para imagenes
    const { images = [] } = req.body as IProduct;

    if(images.length < 2 ){
        return res.status(400).json({ message:'El producto necesita al menos 2 imágenes'});
    }

    //TODO: posiblemente tendremos un localhost:3000/products/ass.jpg
    try{
        await db.connect();
        if (await productFindOne( req.body.slug ) )
            return res.status(400).json({ message: 'Ya existe un producto con ese slug'});
        
        const product = new Product( req.body );
        await product.save();
        await db.disconnect();
        
        return res.status(201).json( product );
    }catch(error){
        console.log(error);
        await db.disconnect();
        return res.status(400).json({message: 'Revisar logs del servidor'});
    }
}

async function productFindOne(slug:string ){
    let productEncontrado: boolean = false;    
    try{
        await db.connect();
        const productInDb = await Product.findOne({ slug: slug });
        
        if(productInDb) {
            await db.disconnect();
            productEncontrado = true;
        }
        }catch(err){
            console.log(err);
            productEncontrado = false;
        } finally{
            return productEncontrado;
        }
    }


async function updateProduct(req: NextApiRequest, res: NextApiResponse<Data>) {
    const {_id ='', images= [] } = req.body as IProduct;

    if(!isValidObjectId(_id)){
        return res.status(400).json({message:'El id del producto no es válido'});
    }
    
    if(images.length < 2 ){
        return res.status(400).json({message:'Es necesario al menos 2 imágenes'});
    }

    //TODO: posiblemente tendremos un localhost:3000/products/ass.jpg
    try{

        const product = await findByIdProduct( _id );
        if(!product){
            db.disconnect();
            return res.status(400).json({ message: 'No existe un producto con ese ID'});
        }

        // TODO: eliminar fotos en Cloudinary
        // https://res.cloudinary.com/cursos-udemy/image/upload/v1645914028/nct31gbly4kde6cncc6i.jpg
        product.images.forEach( async (image) => {
            if(!images.includes(image)){
                //Borrar cloudinary
                const [fileId, extension ] = image.substring(image.lastIndexOf('/')+1).split('.');
                console.log({image, fileId, extension});
                //await cloudinary.uploader.destroy(fileId);
            }
        });

        await product.update(req.body);
        await db.disconnect();

        return res.status(200).json(product);

    }catch(error){
        console.log(error);
        await db.disconnect();
        return res.status(400).json({message: 'Revisar logs del servidor'});
    }
}

async function findByIdProduct( _id:string ){
    try{
        await db.connect();
        return await Product.findById(_id);
    }catch(err){
        await db.disconnect();
        return false;
    }
}
