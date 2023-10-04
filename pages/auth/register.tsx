import React from 'react'
import { useState } from 'react';

import {useContext} from 'react';
import { useRouter } from 'next/router';
import NextLink from 'next/link';

import { Box, Button, Grid, TextField, Typography, Link, Chip } from '@mui/material';
import { ErrorOutline, ErrorSharp } from '@mui/icons-material';
import { useForm } from 'react-hook-form';

import { AuthLayout } from '../../components/layouts';
import { AuthContext } from '../../context';

type FormData = {
    name : string;
    email : string;
    password : string;
};

const PageRegister = () => { 
    
    //react hook-form
    const {register, handleSubmit, formState: {errors} } = useForm<FormData>(); 
    const [mostrarMensajeError, establecerMensajeError] = useState(false);

    const router = useRouter();
    const {registerUser} = useContext(AuthContext);
    const [errorMensaje, establecerErrorMensaje] = useState('');

    const onRegisterForm = async ( {name, email, password}: FormData) =>{
        
        establecerMensajeError(false);
        const { hasError, message} = await registerUser(name, email, password);
        if(hasError){
            console.log(`Error en registro `);
            establecerErrorMensaje(message!);
            setTimeout(() => establecerMensajeError(false), 3000);
            return;
        }

        const destination = router.query.p?.toString() || '/';
        router.replace(destination);
    }

    return (
            <AuthLayout title='Registrar-Usuario'>
                <form onSubmit={handleSubmit(onRegisterForm)} noValidate>
                    <Box sx={{ width: 350, padding:'10px 20px' }}>
                        <Grid container spacing={2}>

                            <Grid item xs={12}>
                                <Typography variant='h1' component='h1'>Crear cuenta</Typography>
                                <Chip 
                                    sx={{ display: mostrarMensajeError ? 'flex': 'none'}}
                                    label='No reconocemos ese usuario / password'
                                    color = 'error'
                                    icon={<ErrorOutline/>}
                                    className='fadeIn'></Chip>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField label='Nombre completo' variant='filled' fullWidth 
                                {...register('name',{
                                    required:'Este campo es requerido',
                                    minLength: {value:2, message:'Mínimo 2 caracteres.'}})}
                                    error={ !!errors.name}
                                    helperText={errors.name?.message}
                                    ></TextField>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField label='Correo' variant='filled' fullWidth
                                type='email'
                                {...register('email', {
                                    required:'Este campo es requerido',
                                    pattern: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                                })}
                                error={ !!errors.email}
                                helperText={errors.email?.message}></TextField>
                            </Grid>

                            <Grid item xs={12}>
                                <TextField label='Contraseña' type='password' variant='filled' fullWidth
                                {...register('password',{
                                    required:'Este campo es requerido',
                                    minLength: {value: 6, message:'Mínimo 6 caracteres.'}

                                })}
                                error={!!errors.password}
                                helperText={errors.password?.message}></TextField>
                            </Grid>

                            <Grid item xs={12}>
                                <Button color='secondary' className='circular-btn' size='large' fullWidth
                                type='submit'>
                                crear usuario
                                </Button>
                            </Grid>
                            <Grid item xs={12} display='flex' justifyContent='end'>
                                <Link href={router.query.p ?` /auth/login?p=${router.query.p}` : '/auth/login'} component={NextLink} underline='always'>
                                    Ya tienes cuenta?
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </form>
            </AuthLayout>
    )
}

export default PageRegister;