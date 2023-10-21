import React,{ useEffect, useState } from 'react'
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { signIn } from 'next-auth/react' 
import { getServerSession } from "next-auth/next" 
import { getProviders } from "next-auth/react"


import { Box, Button, Chip, Divider, Grid, Link, TextField, Typography } from '@mui/material'
import { ErrorOutline } from '@mui/icons-material';
import { useForm } from 'react-hook-form';

import { AuthLayout } from '../../components/layouts'

type FormData = {
    email   : string,
    password: string
};

const LoginPage = () => {
    //transformar objeto al valor boolean con !!error.email
    //!!errors.email
    //TODO: Arreglar validation de email no funciona con validate: validations.isEmail
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
    
    const router = useRouter();

    const onLoginUser = async ({email, password }:FormData) =>{
        setShowErrorChip(false);
        await signIn('credentials',{email , password});
    }
    const [showErrorChip,setShowErrorChip] = useState(false); 
    const [providers, setProviders] = useState<any> ({});

    useEffect(() => {
      getProviders().then(prov => {
        console.log({prov})
        setProviders(prov);
      })
    }, [])
    

    return (
    <AuthLayout title='Ingresar'>
        <form onSubmit={handleSubmit(onLoginUser)}> 
            <Box sx={{ width: 350, padding:'10px 20px' }}>
                <Grid container spacing={2}>

                    <Grid item xs={12}>
                        <Typography variant='h1' component='h1'>Iniciar Sesión</Typography>
                        <Chip 
                            sx={{ display: showErrorChip ? 'flex': 'none'}}
                            label='No reconocemos ese usuario / contraseña'
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
                            minLength: { value: 6 , message:'Mínimo 6 caracteres.'}
                        })}
                        error={ !!errors.password}
                        helperText={errors.password?.message}></TextField>
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
                        <Link href={router.query.p ?` /auth/register?p=${router.query.p}` : '/auth/register'} component={NextLink} underline='always'>
                            No tienes cuenta?
                        </Link>
                    </Grid>

                    <Grid item xs={12} display='flex' flexDirection='column' justifyContent='end'>
                        <Divider sx={{width:'100%', mb: 2 }} />
                        {
                            Object.values(providers).map(
                                (provider: any) => {
                                    if(provider.id === 'credentials')
                                        return (<div key='credentials'></div>)

                                    return (
                                        <Button
                                        key={provider.id}
                                        variant='outlined'
                                        fullWidth
                                        color='primary'
                                        sx={{mb: 1}}
                                        onClick={ () => signIn(provider.id)}
                                        >{provider.name}</Button>
                                    )
                                }
                            )
                        }
                    </Grid>
                </Grid>
            </Box>
        </form>
    </AuthLayout>
  )
}

//No se carga la pagina si existe session de lado usuario
//Porque toda la informacion esta en cookies
//cuando se realiza el request al login 
//ya se tiene informacion si esta authenticado o no por la cookies
// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

import { GetServerSideProps } from 'next'
import { authOptions } from '../api/auth/[...nextauth]';

export const getServerSideProps: GetServerSideProps = async ({req, res, query}) => {
    const session = await getServerSession(req, res, authOptions)
    const {p='/'} = query

    if(session){
        return {
            redirect:{
                destination: p.toString(),
                permanent: false
            }
        }
    }

    return {
        props: { }
    }
}



export default LoginPage