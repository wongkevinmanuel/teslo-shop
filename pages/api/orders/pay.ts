import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next'
import { IPaypal } from '../../../interfaces';
import { db } from '../../../database';
import { Order } from '../../../models';

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
}

//Ejemplo de postman envio token a paypal
const getPaypalBearerToken = async (): Promise<string | null> => {
    const PAYPAL_CLIENT = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID; 
    const PAYPAL_SECRET = process.env.PAYPAL_SECRET;

    const base64Token = Buffer.from(`${PAYPAL_CLIENT}:${PAYPAL_SECRET}`,`utf-8`).toString('base64');
    const body = new URLSearchParams('grant_type=client_credentials');

    try{
        const { data } = await axios.post(process.env.PAYPAL_OAUTH_URL || '',body,{
            headers: {
                'Authorization': `Basic ${base64Token}`,
                'Content-Type' : 'application/x-www-form-urlencoded'
            }
        });

        return data.access_token;
    }catch(error){
        if(axios.isAxiosError(error)){
            console.log(error.response?.data);
        }else{
            return null;
        }
    }

}
const payOrder = async ( req: NextApiRequest, res: NextApiResponse<Data>)=> {
    //TODO: VALIDAR SESION DE USUARIO
    //TODO: VALIDAR MONGOID

    //Token de validacion desde el back-end
    const paypalBearerToken = await getPaypalBearerToken(); 
    
    if( !paypalBearerToken){
        return res.status(400).json({menssage: 'No se pudo confirmar el token de paypal.'});
    }

    //request tiene el transaccion id y orden id
    const { transactionId = '', orderId='' } = req.body;

    //peticion a paypal para confirmar si el orderId asociado al transactionId esta pagado
    const { data } = await axios.get<IPaypal.PaypalOrderStatusResponse>(`${process.env.PAYPAL_ORDERS_URL}/${transactionId}`,{
        headers:{
            'Authorization':`Bearer ${ paypalBearerToken}`
        }
    });

    if(data.status !== 'COMPLETED'){
        return res.status(401).json({menssage:'Orden no reconocida.'});
    }

    //Todo pagado, se prosige a pagar
    await db.connect();
    const dbOrder = await Order.findById(orderId);

    //no existe orden, para marcar como pagada
    if( !dbOrder){
        await db.disconnect();
        return res.status(400).json({menssage:'Orden no existe en nuestra base de datos'});
    }

    //si los montos son diferentes de lo que regresa paypal
    //contra la orden
    if( dbOrder.total !== Number(data.purchase_units[0].amount.value) ){
        await db.disconnect();
        return res.status(400).json({menssage:'Los montos de Paypal y nuestra orden no son iguales'});
    } 

    
    dbOrder.transactionId = transactionId;
    dbOrder.isPaid = true;
    await dbOrder.save();

    await db.disconnect();
    return res.status(200).json({menssage:'Orden pagada'});
 
}