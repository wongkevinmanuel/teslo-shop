import type { NextApiRequest, NextApiResponse } from 'next'

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

const createOrder = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    return await res.status(201).json({menssage:'Hola mundo'});
}
