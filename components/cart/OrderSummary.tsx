import { Grid, Typography } from '@mui/material'
import React from 'react'

export const OrderSummary = () => {
  return (
    <Grid container>
        <Grid item xs={6}>
            <Typography> No. Productos</Typography>
        </Grid>
        <Grid item xs={6} display='flex' justifyContent='end'>
            <Typography> 3 items</Typography>
        </Grid>
        
        <Grid item xs={6}>
            <Typography> SubTotal</Typography>
        </Grid>
        <Grid item xs={6} display='flex' justifyContent='end'>
            <Typography> {`${ 105.35 }`} </Typography>
        </Grid>
        
        <Grid item xs={6}>
            <Typography> Impuestos (15%) </Typography>
        </Grid>
        <Grid item xs={6} display='flex' justifyContent='end'>
            <Typography> {`${35.24}`} </Typography>
        </Grid>
        
        <Grid item xs={6}>
            <Typography variant='subtitle1'> Total: </Typography>
        </Grid>
        <Grid item xs={6} display='flex' justifyContent='end'>
            <Typography variant='subtitle1'> {`${186.54}`} </Typography>
        </Grid>


    </Grid>
  )
}
