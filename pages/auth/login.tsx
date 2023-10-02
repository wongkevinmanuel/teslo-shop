import React,{ useState } from 'react'
import { useContext } from 'react'
import NextLink from 'next/link';

import { Box, Button, Chip, Grid, Link, TextField, Typography } from '@mui/material'
import { ErrorOutline } from '@mui/icons-material';
import { useForm } from 'react-hook-form';

import { AuthContext } from '../../context';
import { AuthLayout } from '../../components/layouts'
import { useRouter } from 'next/router';

type FormData = {
    email   : string,
    password: string
};

const LoginPage = () => {
    //transformar objeto al valor boolean con !!error.email
    //!!errors.email
    //TODO: Arreglar validation de email no funciona con validate: validations.isEmail
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
    //console.log({errors});
    
    const { loginUser } = useContext(AuthContext);
    const router = useRouter();

    const onLoginUser = async ({email, password }:FormData) =>{
        setShowErrorChip(false);
        const isValiadLogin = await loginUser(email, password);
        
        if(!isValiadLogin){
            setShowErrorChip(true);
            setTimeout( () => setShowErrorChip(false), 3000 );
            return;
        }

        //TODO: navegar a la pantalla del usuario
        const destination = router.query.p?.toString() || '/';
        router.replace(destination);

    }
    
    const [showErrorChip,setShowErrorChip] = useState(false); 

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