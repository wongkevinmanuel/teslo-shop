import type { NextApiRequest, NextApiResponse } from 'next'
import { IProduct } from '../../../interfaces';
import { db } from '../../../database';
import { Product } from '../../../models';

type Data = | { menssage: string } | IProduct[] ;

export default function hanlder(req: NextApiRequest, res: NextApiResponse<Data>) {
    switch(req.method){
        case 'GET':
            return searchProducts(req, res);
        default:
            res.status(400).json({ menssage: 'BAD request...' })
    }
}

const searchProducts = async(req: NextApiRequest, res: NextApiResponse<Data>) => {
    let { q=' '} = req.query;

    if(q.length === 0){
        res.status(400).json({ menssage: 'Debe de especificar el query de busqueda.' });
    }
    q = q.toString().toLowerCase();
    
    //buscar
    await db.connect();
    //La busqueda se realiza con indice para conectar
    //dos campos: title, tags
    const products = await Product.find({
        $text: {$search: q}
    })
    .select('title images price inStock slug -_id')
    .lean();
    
    await db.disconnect();

    if(!products){
        return res.status(400).json({menssage:'No existe producto.'});
    }

    return res.status(200).json(products);

}
