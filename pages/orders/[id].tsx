import React,{ useState }  from 'react'
import { ShopLayout } from '../../components/layouts'
import { Box, Card, CardContent, Chip, CircularProgress, Divider, Grid, Link, Typography } from '@mui/material'
import { CartList, OrderSummary } from '../../components/cart'
import { CreditScoreOutlined,  } from '@mui/icons-material';

import { getServerSession } from "next-auth/next" 

import { GetServerSideProps, NextPage } from 'next'
import { authOptions } from '../api/auth/[...nextauth]';
import { dbOrders } from '../../database';
import { IOrder } from '../../interfaces';

import {  PayPalButtons } from '@paypal/react-paypal-js';
import tesloApi from '../../api/tesloApi';
import { useRouter } from 'next/router';

export type OrderResponseBody = {
    id: string;
    status: 
        | "COMPLETED"
        | "SAVED"
        | "APPROVED"
        | "VOIDED"
        | "PAYER_ACTION_REQUIRED"

}

interface Props{
    order: IOrder;
}

const OrderPage: NextPage<Props> = ({order}) => {
    const router = useRouter();
    const {shippingAddress} = order;
    const [isPaying, setIsPaying] = useState(false);

    const onOrderCompleted = async (details: OrderResponseBody) => {
        //console.log({details});
        if(details.status !== 'COMPLETED') {
            return alert('No hay pago en Paypal');
        }   

        setIsPaying(true);

        try{
            
            const {data} = await tesloApi.post(`/orders/pay`,{
                transactionId: details.id,
                orderId: order._id
            });
            router.reload();

        }catch(error){
            setIsPaying(false);
            console.log(error);
            alert('Error');
        }
    }

    //Metodos del boton paypal
    const createOrder = async (data:any, actions:any)=> {
        return actions.order.create({
            purchase_units: [
                {
                    amount: {
                        value: `${order.total}`
                    },
                },
            ],
        });
    }
    
    const onApprove =  async (data:any, actions:any) =>{
        //El pedido se captura en el servidor.
        return actions.order!.capture().then((details:any)=>{
            onOrderCompleted(details);
            //const name = details.payer.name.given_name;
            //alert(`Transaction completed by ${name}`);
        }); 
    
    }

    return (
    <ShopLayout title={'Remusen de la orden'} pageDiscription={'Remusen de orden'}>
        <Typography variant='h1' component='h1'>
            Orden: {order._id}
        </Typography>
        {
            order.isPaid ? (
                <Chip sx={{my: 2}}
                label="Orden ya fue pagada"
                variant='outlined'
                color='success'
                icon={<CreditScoreOutlined/>}></Chip>
            ): (
                <Chip sx={{my: 2}}
                label="Pendiente de pago"
                variant='outlined'
                color='error'
                icon={<CreditScoreOutlined/>}></Chip>
            )
        }

        <Grid container className='fadeIn'>
            <Grid item xs={ 12 } sm={ 7 }>
                <CartList editable={false} products={order.orderItems}>
                </CartList>   
            </Grid>
            <Grid item xs={ 12 } sm={ 5 }>
                <Card className='summary-card'>
                    <CardContent>
                        <Typography variant='h2'>
                            Resumen de la orden
                        </Typography>
                        <Divider sx={{ my:1 }} />
                        {/* Order Summary */}
                        <Box display='flex' justifyContent='space-between'>
                            <Typography variant='subtitle1'>Direccion de Entrega
                            </Typography>
                        </Box>

                        <Typography >
                            Nombre: {shippingAddress.firstName} {shippingAddress.lastName}
                        </Typography>
                        <Typography>
                            Dirección: {shippingAddress.address} { shippingAddress.address2 ? `,${shippingAddress.address2}`: ''}
                        </Typography>
                        <Typography>
                            Ciudad: {shippingAddress.city} , Código posta: {shippingAddress.zip}
                        </Typography>
                        <Typography>
                            País: {shippingAddress.country}
                        </Typography>
                        <Typography>
                            Celular: {shippingAddress.phone}
                        </Typography>
                        
                        <Divider sx={{ my:1 }} />

                        <OrderSummary  orderSummaryData={ {
                                        numberOfItems: order.numberOfItems, 
                                        subTotal: order.subTotal,
                                        tax: order.tax ,
                                        total: order.total} 
                                    }
                        />

                        <Box sx={{ mt:3 }} display='flex' flexDirection='column'>
                            
                            <Box display='flex' justifyContent='center' 
                                className='fadeIn'
                                    sx={{display: isPaying ? 'flex':'none' }}>
                                <CircularProgress/>
                            </Box>
                            <Box flexDirection='column' sx={{display: isPaying? 'none' : 'flex', flex: 1 }}>    
                                {   
                                order.isPaid
                                ? (
                                    <Chip sx={{my: 2}}
                                        label="Pagada"
                                        variant='outlined'
                                        color='success'
                                        icon={<CreditScoreOutlined></CreditScoreOutlined>}></Chip>

                                ):( 
                                    <PayPalButtons
                                        createOrder={ (data,actions) => createOrder(data,actions) }
                                        onApprove={ (data, action) => onApprove(data, action) }   >
                                    </PayPalButtons>
                                )
                                }
                            </Box>
                        </Box>
                    </CardContent>
                </Card>

            </Grid>
        </Grid>
    </ShopLayout>
  )
}

// Renderizado del lado del servido
export const getServerSideProps: GetServerSideProps = async ({req, res, query}) => {
    const { id = '' } = query;
    const session = await getServerSession(req, res, authOptions);
    
    //No hay session
    if(!session){
        return{
            redirect: {
                destination: `/auth/login?p=/orders/${id}`,
                permanent: false,
            }
        }
    }
    
    const order = await dbOrders.getOrderById(id.toString());
    //No hay orden
    if(!order){
        return{
            redirect: {
                destination: `/orders/history`,
                permanent: false,
            }
        }
    }

    //usuario quiere ver orden de otra persona
    if( order.user !== session.user._id){
        return{
            redirect:{
                destination: '/orders/history',
                permanent: false,
            }
        }

    }
    
    return {
        props: {
            order
        }
    }
}

export default OrderPage;