import jwt from 'jsonwebtoken'

export const signToken = (_id: string, email:string): string => {
    
    if(!process.env.JWT_SECRET_SEED){
        throw new Error('No hay semilla de JWT - Revisar archivo de variables de entorno(.env).');
    }

    const jwtToken:string = jwt.sign(
        //payload
        {_id, email },
        //Seed
        process.env.JWT_SECRET_SEED,
        //Opciones
        { expiresIn: '30d'}
    );

    return jwtToken;
}

export const isValidToken = ( token:string ):Promise<string> => {
    if(!process.env.JWT_SECRET_SEED){
        throw new Error(
            'No hay semilla de JWT - Revisar variables de entorno'
        );
    }

    if(token.length <= 10){
        //promesa rechazada
        return Promise.reject('JWt no es valido');
    }

    const promesa: Promise<string> = new Promise( (resolve, reject) =>{
        try{
            jwt.verify(token, process.env.JWT_SECRET_SEED || '', 
            (err, payload) => {
                if(err) return reject('JWT no es valido');

                const { _id } = payload as { _id:string };

                resolve(_id);
            })
        }catch(error){
            reject('JWT no es valido');
        }
    })
    
    return promesa;
}


