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

const OrderPage: NextPage<Props> = (props) => {
    console.log(props.order);
  {/* <Chip sx={{my: 2}}
        label="Pendiente de pago"
        variant='outlined'
        color='error'
        icon={<CreditCardOffOutlined></CreditCardOffOutlined>}></Chip>
        */}
    return (
    <ShopLayout title={'Remusen de orden #0001'} pageDiscription={'Remusen de orden'}>
        <Typography variant='h1' component='h1'>
            Orden: ABC0001
        </Typography>

        

        <Chip sx={{my: 2}}
        label="Pagada"
        variant='outlined'
        color='success'
        icon={<CreditScoreOutlined></CreditScoreOutlined>}></Chip>

        <Grid container>
            <Grid item xs={ 12 } sm={ 7 }>
                <CartList editable={false}></CartList>   
            </Grid>
            <Grid item xs={ 12 } sm={ 5 }>
                <Card className='summary-card'>
                    <CardContent>
                        <Typography variant='h2'>
                            Resumen 3 productos
                        </Typography>
                        <Divider sx={{ my:1 }} />
                        {/* Order Summary */}
                        <Box display='flex' justifyContent='space-between'>
                            <Typography variant='subtitle1'>Direccion de Entrega
                            </Typography>
                            <Link href='/checkout/address' component={NextLink} underline='always'>
                                Editar
                            </Link>
                        </Box>

                        <Typography >
                            Kevin Onofre
                        </Typography>
                        <Typography>
                            303 Edificio - 12 de Octubre y 10 primera
                        </Typography>
                        <Typography>
                            Quevedo, Centro 10305
                        </Typography>
                        <Typography>
                            Ecuador
                        </Typography>
                        <Typography>
                            +1 0941629388
                        </Typography>
                        
                        <Divider sx={{ my:1 }} />

                        <Box display='flex' justifyContent='end'>
                            <Link href='/cart' component={NextLink} underline='always'>
                                Editar
                            </Link>
                        </Box>

                        <OrderSummary/>

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
            Order
        }
    }
}

export default OrderPage;