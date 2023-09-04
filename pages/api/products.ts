import type { NextApiRequest, NextApiResponse } from 'next'
import { SHOP_CONSTANTS, db } from '../../database';
import { Product } from '../../models';
import { IProduct } from '../../interfaces';

type Data = | IProduct[] 
            | { menssage: String};

export default function hanlder(req: NextApiRequest, res: NextApiResponse<Data>) {
    switch(req.method)
    {
        case 'GET':
                return getProducts(req,res);
        case 'POST':
                return getProducts(req,res);
        default:
            return res.status(400).json({ menssage: 'Bad request, metodo default' });
    }
}

const getProducts = async (req: NextApiRequest, res: NextApiResponse<Data> ) => {
    //localhost:3000/api/products?gender=all
    //desestructurar
    //default gender = all
    const { gender = 'all' } = req.query;

    let condition = {};

    if ( gender !== 'all' && SHOP_CONSTANTS.validGenders.includes(`${gender}`) ) {
        condition = { gender };
    }

    await db.connect();
    const products = await Product.find(condition)
                                .select('title images price inStock slug -_id')
                                .lean();

    await db.disconnect();
    return res.status(200).json( products );
}