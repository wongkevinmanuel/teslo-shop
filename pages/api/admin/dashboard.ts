import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../database';
import { Order, Product, User } from '../../../models';

type Data = {
    numberOfOrders:         number;
    paidOrders:             number; // isPad true
    notPaidOrders:          number;
    numberOfClients:        number; //role: client
    numberOfProducts:       number;
    productsWithNoInventory:number; //0
    lowInventory:           number; //productos con 10 o menos

} | { message: string };



export default async function (req: NextApiRequest, res: NextApiResponse<Data>) {
    
    switch(req.method){
        case 'GET':

            try{

                await db.connect();
            
                const [ numberOfOrders,
                        paidOrders,
                        numberOfClients,
                        numberOfProducts,
                        productsWithNoInventory,
                        lowInventory, ] = await Promise.all([
                       
                    Order.count(),
                    Order.find({isPaid: true}).count(),
                    User.find({role:'client'}).count(),
                    Product.count(),
                    Product.find({inStock: 0 }).count(),
                    Product.find({inStock: { $lte: 10}}).count()
                ]);

                await db.disconnect();
                
                return res.status(200).json({
                    numberOfOrders,
                    paidOrders,
                    numberOfClients,
                    numberOfProducts,
                    productsWithNoInventory,
                    lowInventory,
                    notPaidOrders: numberOfOrders - paidOrders

                });
            }catch(error ){
                console.log(error);
                return res.status(503).json({message:'Error al obtener los datos.'});
            }

        default:
            return res.status(400).json( {message:"BAD REQUEST"});
    }
}
