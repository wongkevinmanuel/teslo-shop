import React from 'react'
import { Box, Button, Grid, Link, TextField, Typography } from '@mui/material'
import { AuthLayout } from '../../components/layouts'
import NextLink from 'next/link';

const LoginPage = () => {
  return (
    <AuthLayout title='Ingresar'>
        <Box sx={{ width: 350, padding:'10px 20px' }}>
            <Grid container spacing={2}>

                <Grid item xs={12}>
                    <Typography variant='h1' component='h1'>Iniciar Sesion</Typography>
                </Grid>
                <Grid item xs={12}>
                    <TextField label='Correo' variant='filled' fullWidth></TextField>
                </Grid>
                <Grid item xs={12}>
                    <TextField label='Contrasena' type='password' variant='filled' fullWidth></TextField>
                </Grid>

                <Grid item xs={12}>
                    <Button color='secondary' className='circular-btn' size='large' fullWidth>
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
    </AuthLayout>
  )
}


export default LoginPage