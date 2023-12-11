import type { NextApiRequest, NextApiResponse } from 'next'
import { IProduct } from '../../../interfaces'
import { db } from '../../../database';
import { Product } from '../../../models';

type Data = 
|{  message: string }
| IProduct[]
| IProduct

export default function (req: NextApiRequest, res: NextApiResponse<Data>) {
    
    switch (req.method) {
        case 'GET':
            return getProducts(req, res);
        case 'POST':
            return ;
        case 'PUT':
            return ;
    
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
