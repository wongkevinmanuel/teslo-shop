import React from 'react'
import { ShopLayout } from '../../components/layouts'
import { Box, Button, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material'
import { GetServerSideProps } from 'next'
import { jwt } from '../../utils'

const address = () => {
  return (
    <ShopLayout title='Direccion' pageDiscription='Confirmar direccion de destino' >
        <Typography variant='h1' component='h1'> Direccion </Typography>

        <Grid container spacing={2} sx={{ mt:2}}>
            {/* xs = pantallas muy pequenas sm= pantallas no tan pequenas */}
            <Grid item xs={12} sm={6}>
                <TextField label='Nombre' variant='filled' fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField label='Apellido' variant='filled' fullWidth />
            </Grid>
            
            <Grid item xs={12} sm={6}>
                <TextField label='Direccion' variant='filled' fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField label='Direccion 2' variant='filled' fullWidth />
            </Grid>
            
            <Grid item xs={12} sm={6}>
                <TextField label='Codigo postal' variant='filled' fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField label='Ciudad' variant='filled' fullWidth />
            </Grid>
            
            <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                    <Select
                    variant='filled'
                    label='Pais'
                    value={1}>
                        <MenuItem value={1}>Costa Rica</MenuItem>
                        <MenuItem value={2}>Honduras</MenuItem>
                        <MenuItem value={3}> El Salavador</MenuItem>
                        <MenuItem value={4}> Mexico</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField label='Telefono' variant='filled' fullWidth />
            </Grid>
        </Grid>
        <Box sx={{mt: 5}} display='flex' justifyContent='center'>
            <Button color='secondary' className='circular-btn' size='large'>
                Revisar pedido
            </Button>
        </Box>
    </ShopLayout>
  )
}

export default address;

export const getServerSideProps: GetServerSideProps = async({req}) => {
    const { token = ''} = req.cookies;
    let userId = '';
    let isValidToken = false;

    try{
        await jwt.isValidToken(token);
        isValidToken = true;
    }catch(er){
        isValidToken = false;
    }

    if(!isValidToken){
        return{
            redirect: {
                destination: '/auth/login?p=/checkout/address',
                permanent: false,
            }
        }    
    }

    return {
        props:{
            props:{

            }
        }
    }
}