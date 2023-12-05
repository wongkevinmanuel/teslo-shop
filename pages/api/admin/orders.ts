import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../database';
import { Order } from '../../../models';
import { IOrder } from '../../../interfaces/order';

type Data = | { message: string }
            |    IOrder[] ;

export default function (req: NextApiRequest, res: NextApiResponse<Data>) {
    switch (req.method) {
        case 'GET':
            return getAllOrders(req, res);    
        default:
            res.status(400).json({ message: 'Bad request' });
        }
}

async function getAllOrders(req: NextApiRequest, res: NextApiResponse<Data>) {
    db.connect();
    const ordenes =  await Order.find().sort({createdAt: 'desc'}).populate('user','name email').lean();
    db.disconnect();
    return res.status(200).json( ordenes );
}
