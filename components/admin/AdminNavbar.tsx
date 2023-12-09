import React from 'react'
import { useContext } from 'react';
import NextLink from 'next/link';

import {Link, AppBar, Toolbar, Typography, Box, Button} from '@mui/material'

import { UiContext } from '../../context';

export const AdminNavbar = () => {

    const {openSideMenu} = useContext(UiContext);
    
    return (
    <AppBar>
        <Toolbar>
            <Link display='flex' alignItems='center' component={NextLink} href='/'>
                <Typography variant='h6'> Teslo | </Typography>
                <Typography sx={{ml: 0.5}}> Shop</Typography>
            </Link>
            
            <Box flex={1} />
  
            <Button onClick={ openSideMenu }>
                Menú
            </Button>
        </Toolbar>
    </AppBar>
  )
}