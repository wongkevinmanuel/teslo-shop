import type { NextApiRequest, NextApiResponse } from 'next'
import { IOrder } from '../../../interfaces';

import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../api/auth/[...nextauth]';
import { db } from '../../../database';
import { Product, Order } from '../../../models';

type Data = 
        | { menssage: string} 
        | IOrder;

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
            //prod.id es el id propio del producto
            const currentPrice = dbProducts.find( prod => prod.id === current._id )?.price;
            
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


        const userId = session.user._id;
        const newOrder = new Order({...request.body, isPaid: false, user: userId});
                        //Mantener siempre dos decimales
        newOrder.total = Math.round(newOrder.total * 100)/100;
        
        await newOrder.save();
        await db.disconnect();

        return response.status(201).json(newOrder);

    }catch(error:any){
        await db.disconnect();
        console.log(error);
        response.status(400).json({
            menssage: error.message  || 'Revisar log del servidor'
        });
    }

    return response.status(201).json(request.body);
}
