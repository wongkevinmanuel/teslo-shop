import React, { useState } from 'react'
import { Box, Button, Chip, Grid, Link, TextField, Typography } from '@mui/material'
import { AuthLayout } from '../../components/layouts'
import NextLink from 'next/link';
import { useForm } from 'react-hook-form';
import tesloApi from '../../api/tesloApi';
import { ErrorOutline } from '@mui/icons-material';

type FormData = {
    email: string,
    password: string
}

const LoginPage = () => {
    //transformar objeto al valor boolean con !!
    //!!errors.email
    //TODO: Arreglar validation de email no funciona con validate: validations.isEmail
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
    console.log({errors});
    
    const onLoginUser = async (dataForm:FormData) =>{
        setShowErrorChip(false);
        try{
            const { data } = await tesloApi.post('/user/login', { dataForm });
            const { token, user } = data;
            console.log({token, user});
        }catch(error){
            console.log('Error en las credenciales');
            setShowErrorChip(true);
            setTimeout( () => setShowErrorChip(false), 3000 );
        }
    }

    const [showErrorChip,setShowErrorChip] = useState(true); //default false 

    return (
    <AuthLayout title='Ingresar'>
        <form onSubmit={handleSubmit(onLoginUser)}> 
            <Box sx={{ width: 350, padding:'10px 20px' }}>
                <Grid container spacing={2}>

                    <Grid item xs={12}>
                        <Typography variant='h1' component='h1'>Iniciar Sesión</Typography>
                        <Chip 
                            sx={{ display: showErrorChip ? 'flex': 'none'}}
                            label='No reconocemos ese usuario / password'
                            color='error'
                            icon={<ErrorOutline/>}
                            className='fadeIn'></Chip>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField label='Correo' variant='filled' type='email' fullWidth
                        {...register('email',{
                            required: 'Este campo es requerido',
                            pattern: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                            })}

                        error={ !!errors.email }
                        helperText={errors.email?.message}></TextField>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField label='Contraseña' type='password' variant='filled' fullWidth
                        {...register('password',{
                            required: 'Este campo es requerido',
                            minLength: { value: 6 , message:'Minimo 6 caracteres.'}
                        })}
                        error={ !!errors.password}
                        helperText={errors.password?.message}
                        ></TextField>
                    </Grid>

                    <Grid item xs={12}>
                        <Button
                            type='submit' 
                            color='secondary' 
                            className='circular-btn' size='large' fullWidth>
                            Ingresar
                        </Button>
                    </Grid>
                    <Grid item xs={12} display='flex' justifyContent='end'>
                        <Link href='/auth/register' component={NextLink} underline='always'>
                            No tienes cuenta?
                        </Link>
                    </Grid>
                </Grid>
            </Box>
        </form>
    </AuthLayout>
  )
}


export default LoginPage