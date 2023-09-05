// para el pre frest de la otra pantalla
import { useContext, useState } from 'react';
import React from 'react'
import NextLink from 'next/link';

import {Link, AppBar, Toolbar, Typography, Box, Button, IconButton, Badge, Input, InputAdornment} from '@mui/material'
import { ClearOutlined, SearchOutlined, ShoppingCartOutlined} from '@mui/icons-material';
import { useRouter } from 'next/router';
import { UiContext } from "../../context";

export const Navbar = () => {
    
    const {openSideMenu} = useContext(UiContext);
    const {asPath, push} = useRouter();

    //Manejo del boton de busqueda
    const [searchTerm,setSearchTerm] = useState(''); //Se asocia con el input de busqueda
    
    //Manejo cuando mostrar el input
    const [isSearchVisible,setIsSearchVisible] = useState(false);

    //Buscar Termino
    const onSearchTerm = () => {
        if( searchTerm.trim().length     === 0 ){
            return;
        }
        push(`/search/${ searchTerm }`);    
    }

    return (
    <AppBar>
        <Toolbar>
                <Link display='flex' alignItems='center' component={NextLink} href='/'>
                    <Typography variant='h6'> Teslo - </Typography>
                    <Typography sx={{ml: 0.5}}> Shop</Typography>
                </Link>
            <Box flex={1} />

            <Box sx={{ display: isSearchVisible ? 'none': {xs:'none', sm:'block'}}}
                className='fadeIn'
                >
                    <Link component={NextLink} href='/category/men'>
                        <Button color={ asPath === '/category/men' ? 'primary':'info'}>
                            Hombres
                        </Button>
                    </Link>
                    <Link component={NextLink} href='/category/women'>
                        <Button color={ asPath === '/category/women' ? 'primary':'info'}>
                            Mujeres
                        </Button>
                    </Link>
                    <Link component={NextLink} href='/category/kid'>
                        <Button color={ asPath === '/category/kid' ? 'primary':'info'}>
                            Niños
                        </Button>
                    </Link>
            </Box>
            <Box flex={1} />

            {/* Patallas grandes */}

            {
                /* Si esta permitiendo ver la busqueda*/
                isSearchVisible
                ?(
                    <Input
                        sx={{ display: {xs:'none', sm:'flex'} }}
                        className='fadeIn'
                        autoFocus
                        value={searchTerm}
                        onChange={ (e) => setSearchTerm(e.target.value)}
                        onKeyUp={ (e) => e.key === 'Enter' ? onSearchTerm() : null }
                        type='text'
                        placeholder="Buscar..."
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton 
                                    onClick= {() => setIsSearchVisible(false)} >
                                    <ClearOutlined />
                                </IconButton>
                            </InputAdornment>
                        }
                    />
                ):
                (
                    <IconButton 
                        onClick= {() => setIsSearchVisible(true)}
                        className="fadeIn"
                        sx={{ display:{xs:'none', sm:'flex'} }}
                    >
                        <SearchOutlined />
                    </IconButton>
                )
            }
            

            {/* Patallas pequenas */}
            <IconButton
             sx={{display: {xs:'flex', sm:'none'} }}
             onClick={ openSideMenu }
            >
                <SearchOutlined />
            </IconButton>
                <Link href='/cart' component={NextLink}>
                    <IconButton>
                        <Badge badgeContent={2} color='secondary'>
                            <ShoppingCartOutlined />
                        </Badge>
                    </IconButton>
                    
                </Link>
            <Button onClick={openSideMenu}>
                Menú
            </Button>
        </Toolbar>
    </AppBar>
  )
}