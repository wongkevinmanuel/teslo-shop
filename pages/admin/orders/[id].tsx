import React, { FC } from 'react'
import { IOrder } from '../../../interfaces';
import { AdminLayout } from '../../../components/layouts';
import { Box, Card, CardContent, Chip, Divider, Grid, Typography } from '@mui/material';
import { CreditCardOffOutlined, CreditScoreOutlined, AccessTimeOutlined } from '@mui/icons-material';
import { CartList, OrderSummary } from '../../../components/cart';
import { GetServerSideProps } from 'next';
import { dbOrders } from '../../../database';

interface Props{
    order: IOrder;
}

const OrderPage:FC<Props> = ({order = {} }) => {

    //if ( !order  ||  order == undefined){
    //    order.shippingAddress = {};
    //}

    const { shippingAddress= { } } = order;

    return (

    <AdminLayout title='Resumen de la orden'
        subTitle={`OrdenId: ${ order._id }`}>
        {
            //Verificar el estado de la orden
            order.isPaid ? (
                <Chip sx={{ my:2 }} 
                    label="Orden ya fue pagada"
                    variant='outlined'
                    color='success'
                    icon={ <CreditScoreOutlined/>}
                />
            ): (
                <Chip sx={{ my:2 }} 
                    label="Orden Pendiente de pago"
                    variant='outlined'
                    color='error'
                    icon={ <CreditCardOffOutlined />}
                />
            )
        }
            
        <Grid container className='fadeIn'>
            <Grid item xs={12} sm={7} >
                <CartList products={order.orderItems }></CartList>
            </Grid>
            <Grid item xs={12} sm={5}>
                <Card className='summary-card'>
                    <CardContent>
                        <Typography> Resumen </Typography>
                        <Divider sx={{ my: 1 }} />
                        <Box display='flex' justifyContent='space-between'>
                            <Typography variant='subtitle1'> Dirección de entrega</Typography>
                        </Box>

                        <Typography>Nombres:    { shippingAddress.firstName } { shippingAddress.lastName } </Typography>
                        <Typography>Dirección 1:{ shippingAddress.address   } Dirección 2: { shippingAddress.address2}</Typography>
                        <Typography>Pais:       { shippingAddress.country   }</Typography>
                        <Typography>Ciudad:     { shippingAddress.city      }, Codigo Zip: {shippingAddress.zip} </Typography>
                        <Typography>Celular:    { shippingAddress.phone     }</Typography>

                        <Divider sx={{ my: 1 }} />

                        <OrderSummary 
                            orderSummaryData={
                                {numberOfItems : order.numberOfItems!,
                                subTotal:       order.subTotal!,
                                total:          order.total!,
                                tax:            order.tax!
                            }}
                        />
                        <Box display='flex' flexDirection='column'>
                            {
                                order.isPaid ?
                                (
                                    <Chip sx={{ my:2 , flex:1}}
                                        label="Orden ya fue pagada"
                                        variant='outlined'
                                        color='success'
                                        icon={ <CreditScoreOutlined />} 
                                    />
                                ):(
                                    <Chip sx={{ my:2, flex: 1}}
                                    label="Pendiente de pago"
                                    variant='outlined'
                                    color='error'
                                    icon={<CreditCardOffOutlined />}

                                    
                                    />
                                )
                            }
                        </Box>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>

    </AdminLayout>
  )
}
/*
Deberías usar getServerSideProps cuando:
Solo si necesita renderizar previamente una página 
cuyos datos deben recuperarse en el momento de la solicitud
*/
export const getServerSideProps: GetServerSideProps = async({req, query}) => {

    const { id = '' } = query;
    //Verificar el id
    
    const order = await dbOrders.getOrderById( id.toString() );
    
    if(!order){
        return {
            redirect: {
                destination: '/admin/orders',
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