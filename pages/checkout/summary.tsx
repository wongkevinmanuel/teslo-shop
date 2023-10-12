import React, { useContext } from 'react'
import { ShopLayout } from '../../components/layouts'
import { Box, Button, Card, CardContent, Divider, Grid, Link, Typography } from '@mui/material'
import { CartList, OrderSummary } from '../../components/cart'
import NextLink from 'next/link';
import CartContext from '../../context/cart/CartContext';
import { countries } from '../../utils';

const SummaryPage = () => {
    const { shippingAddress, numberOfItems} = useContext(CartContext);
    // Si es null shippingAddress
    if(!shippingAddress){
        return <></>;
    }

    const {firstName, lastName, address, address2, city, zip, country, phone } = shippingAddress;

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
                            <Typography variant='subtitle1'>Direccion de Entrega
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
                           Pais: { countries.find( (c) => c.code === country )?.name }
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