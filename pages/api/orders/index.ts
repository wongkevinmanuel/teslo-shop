import type { NextApiRequest, NextApiResponse } from 'next'
import { IOrder } from '../../../interfaces';

import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../api/auth/[...nextauth]';
import { db } from '../../../database';
import { Product } from '../../../models';

type Data = {
    menssage: string
}

export default function (req: NextApiRequest, res: NextApiResponse<Data>) {
    
    switch(req.method){
        case 'POST':
            return createOrder(req, res);
        
        default:
            res.status(200).json({  menssage: 'Bad request' })
    }
}

const createOrder = async (request: NextApiRequest, response: NextApiResponse<Data>) => {
    
    const {orderItems , total} =
    request.body as IOrder;

    //verficar que tengamos un usuario
    const session = await getServerSession(request, response, authOptions);

    if(!session){
        return response.status(401).json({menssage: 'Debe de estar autenticado'});
    }

    //Verficar productos contra BD
    const productsIds = orderItems.map( (product:any) => product._id);
    await db.connect();
    
    const dbProducts = await Product.find({_id: {$in: productsIds}});
    
    try{

        const subTotal = orderItems.reduce( (prev, current) => {
            const currentPrice = dbProducts.find( prod => prod._id === current._id )?.price;
            if(! currentPrice){
                throw new Error('Verfique el carrito de nuevo, producto no existe.');
            }

            return (currentPrice * current.quantity) + prev
        }, 0);

        const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE );
        const backendTotal = subTotal * (taxRate + 1);

        if (total !== backendTotal){
            throw new Error('El total no cuadra con el monto');
        }
    }catch(error){

    }

    return response.status(201).json(request.body);
}
