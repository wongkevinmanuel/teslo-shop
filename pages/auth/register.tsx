import React from 'react'
import { AuthLayout } from '../../components/layouts';
import { Box, Button, Grid, TextField, Typography, Link } from '@mui/material';
import NextLink from 'next/link';

const PageRegister = () => {
  return (
        <AuthLayout title='Registrar-Usuario'>
        <Box sx={{ width: 350, padding:'10px 20px' }}>
            <Grid container spacing={2}>

                <Grid item xs={12}>
                    <Typography variant='h1' component='h1'>Crear cuenta</Typography>
                </Grid>
                <Grid item xs={12}>
                    <TextField label='Nombre completo' variant='filled' fullWidth ></TextField>
                </Grid>
                <Grid item xs={12}>
                    <TextField label='Correo' variant='filled' fullWidth ></TextField>
                </Grid>
                <Grid item xs={12}>
                    <TextField label='Contrasena' type='password' variant='filled' fullWidth></TextField>
                </Grid>
                <Grid item xs={12}>
                    <TextField label='Repetir contrasena' type='password' variant='filled' fullWidth></TextField>
                </Grid>

                <Grid item xs={12}>
                    <Button color='secondary' className='circular-btn' size='large' fullWidth>
                    crear usuario
                    </Button>
                </Grid>
                <Grid item xs={12} display='flex' justifyContent='end'>
                    <Link href='/auth/login' component={NextLink} underline='always'>
                        Ya tienes cuenta?
                    </Link>
                </Grid>
            </Grid>
        </Box>
        </AuthLayout>
  )
}

export default PageRegister;