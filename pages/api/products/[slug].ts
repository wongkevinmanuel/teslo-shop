import type { NextApiRequest, NextApiResponse } from 'next'
import { IProduct } from '../../../interfaces'
import { db } from '../../../database';
import { Product } from '../../../models';

type Data =  | { menssage: string } | IProduct ;

export default function hanlder (req: NextApiRequest, res: NextApiResponse<Data>) {
    const {slug = ''} = req.query;

    if(!slug || slug === undefined || slug.length === 0){
        return res.status(400).json({ menssage: 'Deber enviar un slug.' });
    }

    switch ( req.method ){
        case 'GET':
            return getProductBySlug(req, res);
        default:
            return res.status(400).json({menssage:'BAD REQUEST'});
    }
}

const getProductBySlug = async(req: NextApiRequest, res: NextApiResponse<Data>) => {
    try{
        await db.connect();
        const {slug} = req.query;
        const product = await Product.findOne({slug}).lean();
        await db.disconnect();

        if(! product ) {
            return res.status(400).json({menssage:'Producto no encontrado.'});
        }

        return res.json(product);
    }catch(error){
        return res.status(400).json({menssage:`Error:  SLUG: ${ req.query }`});    
    }
}
