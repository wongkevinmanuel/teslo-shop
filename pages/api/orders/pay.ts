import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
    menssage: string
}

export default function (req: NextApiRequest, res: NextApiResponse<Data>) {
    
    switch(req.method){
        case 'POST':
            return payOrder(req, res);
        default:
            return res.status(400).json({
                menssage: `Bad request`
            });
    }
    res.status(200).json({ menssage: 'Example' });
    
    
}
const payOrder = ( req: NextApiRequest, res: NextApiResponse)=> {
        
    return res.status(200).json({ menssage: 'Example' });
}