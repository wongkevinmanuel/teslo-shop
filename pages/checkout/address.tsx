import React from 'react'
import { GetServerSideProps } from 'next'

import { Box, Button, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material'

import { ShopLayout } from '../../components/layouts'
import { countries, jwt } from '../../utils'
import { useForm } from 'react-hook-form'

type FormData = {
    firstName: string,
    lastName: string,
    address: string,
    address2: string,
    zip: string,
    city: string,
    country: string,
    phone: string
}

const address = () => {
    //registrar react form
    const {register, handleSubmit, formState: {errors} } = useForm<FormData>();

    const onClickRevisarPedido = ( {
        firstName,
        lastName,
        address,
        address2,
        zip,
        city,
        country,
        phone}:FormData ) => {

            console.log('Click en el boton revisar pedido')
    }


    return (
    <ShopLayout title='Direccion' pageDiscription='Confirmar direccion de destino' >
        <Typography variant='h1' component='h1'> Direccion </Typography>

        <form onSubmit={handleSubmit( onClickRevisarPedido)}>
        <Grid container spacing={2} sx={{ mt:2}}>
            {/* xs = pantallas muy pequenas sm= pantallas no tan pequenas */}
            <Grid item xs={12} sm={6}>
                <TextField label='Nombre' variant='filled' fullWidth 
                {...register('firstName',{required: 'El primer nombre es requerido'
                }) }/>
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField label='Apellido' variant='filled' fullWidth 
                 {...register('lastName',{required: 'El apellido es requerido'
                }) }/>
            </Grid>
            
            <Grid item xs={12} sm={6}>
                <TextField label='Direccion' variant='filled' fullWidth 
                {...register('address',{required: 'La direccion es requerido'
                }) }/>
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField label='Direccion 2' variant='filled' fullWidth 
                {...register('address2',{required: 'Direccion es requerido'
                }) }/>
            </Grid>
            
            <Grid item xs={12} sm={6}>
                <TextField label='Codigo postal' variant='filled' fullWidth 
                {...register('zip',{required: 'El codigo postal es requerido'
                }) }/>
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField label='Ciudad' variant='filled' fullWidth 
                {...register('city',{required: 'La ciudad es requerido'
                }) }/>
            </Grid>
            
            <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                    <Select
                    variant='filled'
                    label='Pais'
                    value={'CRI'}>
                        {
                            countries.map(
                                (c) => (
                                    <MenuItem 
                                    value={c.code}
                                    key={c.code}>
                                        {c.name}
                                    </MenuItem>
                                )
                            )
                        }
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField label='Telefono' variant='filled' fullWidth 
                {...register('phone',{required: 'El telefono es requerido'
                }) }/>
            </Grid>
        </Grid>
        <Box sx={{mt: 5}} display='flex' justifyContent='center'>
            <Button color='secondary' className='circular-btn' size='large'
            type='submit'>
                Revisar pedido
            </Button>
        </Box>
        </form>
    </ShopLayout>
  )
}

export default address;

//Verificar del lado servidor, si esta autenticado
//de lo contrario no mostrar pagina
//metodo con next inferior version 12
//Se ejecuta siempre que el cliente haga request
//primero funcion y despues renderiza componente
/* export const getServerSideProps: GetServerSideProps = async({req}) => {
    
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
} */