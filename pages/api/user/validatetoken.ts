import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../database';
import User from '../../../models/User';
import { jwt } from '../../../utils';

type Data = {
    message: string
}
|
{
    token: string,
    user: {
            email:string,
            role:string,
            name: string
        }
}

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    switch(req.method){
        case 'GET':
            return checkJWT(req, res);
        default:
            return res.status(200).json({ message: 'Bad request.' });
    }
}

async function checkJWT(request: NextApiRequest, response: NextApiResponse<Data>) {
    const { token = '' } = request.cookies;

    let userId = '';
   
    try{
        userId = await jwt.isValidToken(token);
    }catch(error){
        response.status(200).json({message:'Token de autorizacion no es valido'});
    }
    
    await db.connect();
    const userr = await User.findById(userId).lean();
    await db.disconnect();

    if(!userr){
        return response.status(400)
        .json({ message: 'Usuario no existe con ese id.' });
    }
     
    return response.status(200).json({
        token: jwt.signToken(userr._id, userr.email),
        user: {
            email: userr.email,
            role: userr.role, 
            name: userr.name
        }
    })
}
