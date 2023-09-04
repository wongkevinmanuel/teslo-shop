import React from 'react'
import { ShopLayout } from '../../components/layouts'
import { Box, Button, Card, CardContent, Divider, Grid, Link, Typography } from '@mui/material'
import { CartList, OrderSummary } from '../../components/cart'
import NextLink from 'next/link';

const SummaryPage = () => {
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