import React from 'react'
import NextLink from 'next/link';
import { ShopLayout } from '../../components/layouts';
import { Box, Link, Typography } from '@mui/material';
import { RemoveShoppingCartOutlined } from '@mui/icons-material';

const EmptyPage = () => {
  return (
    <ShopLayout title={'Carrito vacio'} pageDiscription={'No hay articulos'} >
        <Box
        display='flex'
        justifyContent='center'
        alignItems='center'
        height='calc(100vh - 200px)'
        sx={{ flexDirection: { xs:'column', sm: 'row'}}}>
          
            <RemoveShoppingCartOutlined sx={{fontSize: 100}}></RemoveShoppingCartOutlined>
            <Box display='flex' flexDirection='column' alignItems='center'>
                <Typography>
                    Su carrito esta vacio.
                </Typography>
                    <Link typography='h4' color='secondary'component={NextLink} href='/'> Regresar</Link>
            </Box>
        </Box>
    </ShopLayout>
  )
}

export default EmptyPage;