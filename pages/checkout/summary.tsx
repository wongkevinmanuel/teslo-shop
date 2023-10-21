import React, { useContext, useEffect } from 'react'
import NextLink from 'next/link';

import { Box, Button, Card, CardContent, Divider, Grid, Link, Typography } from '@mui/material'

import CartContext from '../../context/cart/CartContext';
import { ShopLayout } from '../../components/layouts'
import { CartList, OrderSummary } from '../../components/cart'
import { countries } from '../../utils';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';

const SummaryPage = () => {
const { shippingAddress, numberOfItems} = useContext(CartContext);

//Siempre debe tener direccion
const router = useRouter();
useEffect(()=> {
    if( !Cookies.get('firstName') ){
        router.push('/checkout/address');
    }

}, [router]);

// Si es null shippingAddress
if(!shippingAddress){
    return <></>;
}

const {firstName, lastName, address, address2='', city, zip, country, phone } = shippingAddress;

  return (
    <ShopLayout title={'Remusen de orden'} pageDiscription={'Remusen de orden'}>
        <Typography variant='h1' component='h1'>
            Resumen de la orden
        </Typography>
        <Grid container>
            <Grid item xs={ 12 } sm={ 7 }>
                <CartList editable={false}></CartList>   
            </Grid>
            <Grid item xs={ 12 } sm={ 5 }>
                <Card className='summary-card'>
                    <CardContent>
                        <Typography variant='h2'>
                            Resumen ({numberOfItems} {numberOfItems === 1 ? 'producto':'productos' } )
                        </Typography>
                        <Divider sx={{ my:1 }} />
                        {/* Order Summary */}
                        <Box display='flex' justifyContent='space-between'>
                            <Typography variant='subtitle1'>Dirección de Entrega
                            </Typography>
                            <Link href='/checkout/address' component={NextLink} underline='always'>
                                Editar
                            </Link>
                        </Box>

                        <Typography >
                            {firstName} { lastName }
                        </Typography>
                        <Typography>
                            {address} {address2 ? `, ${address2} ` : ''}
                        </Typography>
                        <Typography>
                            {city} , Código postal:  {zip}
                        </Typography>
                        <Typography>
                           País: { country }
                        </Typography>
                        <Typography>
                           Telf: {phone}
                        </Typography>
                        
                        <Divider sx={{ my:1 }} />

                        <Box display='flex' justifyContent='end'>
                            <Link href='/cart' component={NextLink} underline='always'>
                                Editar
                            </Link>
                        </Box>

                        <OrderSummary/>

                        <Box sx={{ mt:3 }}>
                            <Button color='secondary' className='circular-btn' fullWidth>
                                Confirmar Orden
                            </Button>
                        </Box>
                    </CardContent>
                </Card>

            </Grid>
        </Grid>
    </ShopLayout>
  )
}

export default SummaryPage;