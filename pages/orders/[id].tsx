import React from 'react'
import { ShopLayout } from '../../components/layouts'
import { Box, Card, CardContent, Chip, Divider, Grid, Link, Typography } from '@mui/material'
import { CartList, OrderSummary } from '../../components/cart'
import { CreditScoreOutlined,  } from '@mui/icons-material';

import { getServerSession } from "next-auth/next" 

import { GetServerSideProps, NextPage } from 'next'
import { authOptions } from '../api/auth/[...nextauth]';
import { dbOrders } from '../../database';
import { IOrder } from '../../interfaces';

import {  PayPalButtons } from '@paypal/react-paypal-js';

interface Props{
    order: IOrder;
}

const OrderPage: NextPage<Props> = ({order}) => {
    
    const {shippingAddress} = order;

    const createOrder = async (data:any)=> {
        return fetch("/my-server/create-paypal-order", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            //use el parámetro "body" para pasar 
            //opcionalmente información adicional del 
            //pedido, como identificadores de productos 
            //y cantidades
            
            body: JSON.stringify({
                cart: [
                    {
                        //id: "654a466054fdd0ca67412cd4",
                        quantity: `${order.total}`,
                    },
                ],
            }),
        }).then((response) => response.json())
          .then((order) => order.id);
    }
    
    const onApprove =  async (data:any, actions:any) =>{
        //El pedido se captura en el servidor.
        console.log(data);
        return fetch("/my-server/capture-paypal-order", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            orderID: data.orderID
          })
        })
        .then((response) => response.json())
        .then((orderData) => {
              const name = orderData.payer.name.given_name;
              alert(`Transaction completed by ${name}`);
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

                        <Box sx={{ mt:3 }}
                            display='flex' flexDirection='column'>
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
                                    createOrder={ (data) => createOrder(data) }
                                    onApprove={ (data, action) => onApprove(data, action) }   >
                                </PayPalButtons>
                           )
                        }
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