import type { NextApiRequest, NextApiResponse } from 'next'
import { db, seedDatabase } from '../../database'
import { Product } from '../../models';
import User from '../../models/User';

type Data = {
    message: string
}

/**
 * End Point semilla para Base de datos
 */
export default async function hanlder(req: NextApiRequest
    , res: NextApiResponse<Data>) {
        //Verificar contexto de produccion
        if (process.env.NODE_ENV === 'production'){
            return res.status(400).json({ message:'NO tiene acceso al API'});
        }
        
        await db.connect();

        await User.deleteMany();
        await User.insertMany( seedDatabase.initialData.users);
    
        //TODO: Controlar catch sin conexion
        await Product.deleteMany();
        await Product.insertMany( seedDatabase.initialData.products);
        await db.disconnect();

        res.status(200).json({ message: 'Proceso realizado correctamente' })
}
