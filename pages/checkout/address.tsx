import React, { useContext, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Box, Button, FormControl, Grid, InputLabel, MenuItem, TextField, Typography } from '@mui/material'
import Cookies from 'js-cookie'
import { useForm } from 'react-hook-form'

import { ShopLayout } from '../../components/layouts'
import { countries, jwt } from '../../utils'
import CartContext from '../../context/cart/CartContext'

type FormData = {
    firstName   : string,
    lastName    : string,
    address     : string,
    address2    : string,
    zip         : string,
    city        : string,
    country     : string,
    phone       : string
}

const getAddressFromCookies = (): FormData =>{
    return {
        firstName  :  Cookies.get('firstName')   || '',
        lastName   :  Cookies.get('lastName')    || '',
        address    :  Cookies.get('address')     || '',
        address2   :  Cookies.get('address2')    || '',
        zip        :  Cookies.get('zip')         || '',
        city       :  Cookies.get('city')        || '',
        country    :  Cookies.get('country')     || '',
        phone      :  Cookies.get('phone',  )    || '',  
    };
}

const address = () => {
    //registrar react form
    const {register, handleSubmit, formState: {errors},  reset } = useForm<FormData>(
        {
            defaultValues: getAddressFromCookies()
            /*defaultValues:{
                firstName: '',
                lastName: '',
                address: '',
                address2: '',
                zip: '',
                city: '',
                country: '',
                phone:''
            }*/
        }
    );
    
    //El servidor no lo renderiza hasta que el cliente
    //lo haga, hay lo carga
    useEffect(()=>{
        reset(getAddressFromCookies() );
    }, [reset])

    const router = useRouter();
    //TODO:
    const {updateAddress} = useContext(CartContext);

    const onSubmitRevisarPedido = ( {
        firstName,
        lastName,
        address,
        address2,
        zip,
        city,
        country,
        phone}:FormData ) => {
            
            Cookies.set('firstName',firstName);
            Cookies.set('lastName',lastName);
            Cookies.set('address',address);
            Cookies.set('address2',address2  || '');
            Cookies.set('zip',zip);
            Cookies.set('city',city);
            Cookies.set('country',country);
            Cookies.set('phone',phone);

            const d = {'firstName':firstName,
            'lastName':lastName,
            'address':address,
            'address2':address2,
            'zip':zip,
            'city':city,
            'country':country,
            'phone':phone};
 
            updateAddress(d);
            router.push('/checkout/summary');
            
        }

        //TODO: Arreglar: Establecer el valor del campo pais TextField 
        //de las cookies. defaultValue={ Cookies.get('country') || countries[0].code }
    return (
    <ShopLayout title='Dirección' pageDiscription='Confirmar dirección del destino' >
        <form onSubmit={handleSubmit( onSubmitRevisarPedido)}>
        <Typography variant='h1' component='h1'> Direccion </Typography>

        <Grid container spacing={ 2 } sx={{ mt:2}}>
            {/* xs = pantallas muy pequenas sm= pantallas no tan pequenas */}
            <Grid item xs={12} sm={6}>
                <TextField label='Nombre' variant='filled' fullWidth 
                {...register('firstName',{
                    required: 'El nombre es requerido'
                })}
                error={!!errors.firstName}
                helperText={errors.firstName?.message}
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField label='Apellido' variant='filled' fullWidth 
                 {...register('lastName',{
                    required: 'El apellido es requerido'
                })}
                error={!!errors.lastName}
                helperText={errors.lastName?.message}
                />
            </Grid>
            
            <Grid item xs={12} sm={6}>
                <TextField label='Dirección' variant='filled' fullWidth 
                {...register('address',{required: 'La dirección es requerido'
                })}
                error={!!errors.address}
                helperText={errors.address?.message}
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField label='Dirección 2 (opcional)' variant='filled' fullWidth 
                {...register('address2')}
                />
            </Grid>
            
            <Grid item xs={12} sm={6}>
                <TextField label='Código postal' variant='filled' fullWidth 
                {...register('zip',{required: 'El código postal es requerido'
                })}
                error={!!errors.zip}
                helperText={errors.zip?.message}
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField label='Ciudad' variant='filled' fullWidth 
                {...register('city',{required: 'La ciudad es requerido'
                })}
                error={!!errors.city}
                helperText={errors.city?.message}
                />
            </Grid>
            
            <Grid item xs={12} sm={6}>
                <TextField
                    variant='filled'
                    label='País'
                    {...register('country',{
                        required: 'El país es requerido'
                    })}
                    error={!!errors.country}
                    helperText={errors.country?.message}
                    />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField label='Teléfono' variant='filled' fullWidth 
                {...register('phone',{required: 'El teléfono es requerido'
                })}
                error={!!errors.phone}
                helperText={errors.phone?.message}/>
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