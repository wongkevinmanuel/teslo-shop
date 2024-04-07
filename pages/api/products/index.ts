import type { NextApiRequest, NextApiResponse } from 'next'
import { SHOP_CONSTANTS } from '../../../database/constants';
import { db } from '../../../database';
import { IProduct } from '../../../interfaces'

type Data = | { message: string }
            | IProduct[]  


export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    switch(req.method){
        case 'GET':
            return getProducts(req, res );
        default:
            return res.status(400).json({ message: 'Bad Request' });
    }
}

const getProducts(req: NextApiRequest, res: NextApiResponse<Data>) => {


}