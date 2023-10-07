import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../database';
import User from '../../../models/User';
import bcrypt from 'bcryptjs';
import { jwt } from '../../../utils';

type Data = {
    message: string
}
|
{
    token: string, //jwt
    user: {
            email:string,
            role:string,
            name: string
        }
}

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    switch(req.method){
        case 'POST':
            return loginUser(req, res);
        case 'GET':
            return res.status(200).json({ message:'Bad request GET.'});
        default:
            return res.status(200).json({ message: 'Bad request.' });
    }
}

async function loginUser(request: NextApiRequest, response: NextApiResponse<Data>) {
    const {email = '', password = ''} = request.body;

    await db.connect();
    const user = await User.findOne({email});
    await db.disconnect();

    if(!user){
        return response.status(200).json({ message: 'Correo o password no validos. - EMAIL' });
    }
    
    //comparar los hashs
    //user.password! = siempre se tiene password en bd
    //Si no son comparables los hash
    if( ! bcrypt.compareSync(password, user.password!)){
        return response.status(400).json({ message: 'Correo o password no validos. - Password' });
    }
    
    const { role, name, _id } = user;
    const tokenn:string = jwt.signToken(_id, email);

    return response.status(200).json({
        token: tokenn,
        user: {
            email, role, name
        }
    })
}
