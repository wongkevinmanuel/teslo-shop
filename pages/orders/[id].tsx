import React from 'react'
import { ShopLayout } from '../../components/layouts'
import { Box, Button, Card, CardContent, Chip, Divider, Grid, Link, Typography } from '@mui/material'
import { CartList, OrderSummary } from '../../components/cart'
import NextLink from 'next/link';
import { CreditCardOffOutlined, CreditScoreOutlined } from '@mui/icons-material';
import { getServerSession } from "next-auth/next" 

import { GetServerSideProps, NextPage } from 'next'
import { authOptions } from '../api/auth/[...nextauth]';
import { dbOrders } from '../../database';
import Order from '../../models/Order';
import { IOrder } from '../../interfaces';


interface Props{
    order: IOrder;
}

const OrderPage: NextPage<Props> = ({order}) => {
  console.log(order);
  const {shippingAddress} = order;
  
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
        

        <Grid container>
            <Grid item xs={ 12 } sm={ 7 }>
                <CartList editable={false} products={order.orderItems}>
                </CartList>   
            </Grid>
            <Grid item xs={ 12 } sm={ 5 }>
                <Card className='summary-card'>
                    <CardContent>
                        <Typography variant='h2'>
                            Resumen ({ order.numberOfItems <= 1 ? ('producto'):(`${order.numberOfItems} productos`) })
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

                        <Box sx={{ mt:3 }}>
                           <h1>Pagar</h1>
                           <Chip sx={{my: 2}}
                                label="Pagada"
                                variant='outlined'
                                color='success'
                                icon={<CreditScoreOutlined></CreditScoreOutlined>}></Chip>

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
    console.log(id);

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