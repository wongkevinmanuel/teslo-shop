import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../database';
import User from '../../../models/User';
import bcrypt from 'bcryptjs';
import { jwt, validations } from '../../../util';

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
            return registerUser(req, res);
        case 'GET':
            return res.status(200).json({ message:'Bad request GET.'});
        default:
            return res.status(200).json({ message: 'Bad request.' });
    }
}

async function registerUser(request: NextApiRequest, response: NextApiResponse<Data>) {
    const { email = '', password = '', name = ''} 
    = request.body as { email:string, password: string, name: string};

    if(password.length < 6){
        return response.status(400)
        .json({ message: 'La contrasena debe ser de 6 caracteres.' });
    }

    if(name.length < 2){
        return response.status(400)
        .json({ message: 'El nombre debe ser de 2 caracteres.' });
    }
    
    //TODO: validar email
    if( !validations.isValidEmail(email)){
        return response.status(400)
        .json({ message: 'El correo no es valido.' });
    }

    await db.connect();
    const user = await User.findOne({email});
    
    if(user){
        await db.disconnect();
        return response.status(400)
        .json({ message: 'Usuario ya existe. No puede usar ese correo.' });
    }
    
    const newUser = new User({
        email: email.toLocaleLowerCase(),
        password: bcrypt.hashSync(password),
        role: 'client',
        name
    });
    
    try{
        await newUser.save({validateBeforeSave:true});
    }catch(error){
        console.log(error);
        return response.status(500)
        .json({ message: 'Revisar log del Servidor.' });
    }

    const { _id, role } = newUser;
    const tokenn:string = jwt.signToken(_id, email);

    return response.status(200).json({
        token: tokenn,
        user: {
            email, role, name
        }
    })
}
