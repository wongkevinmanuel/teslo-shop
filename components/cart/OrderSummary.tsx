import React, { useContext, FC } from 'react'
import { Grid, Typography } from '@mui/material'

import CartContext from '../../context/cart/CartContext';
import { currency } from '../../utils';
import { IOrderSummaryData } from '../../interfaces';

interface Props{
    orderSummaryData?: IOrderSummaryData;
}
//{numberOfItems = 0,subTotal = 0, tax=0,total = 0}
export const OrderSummary:FC<Props> = ( {orderSummaryData } ) => {

    const {numberOfItems, subTotal, total, tax } = useContext(CartContext);
    const summaryValues = orderSummaryData ? orderSummaryData : { numberOfItems, subTotal, total, tax};

    //const {numberOfItems = orderSummaryData.numberOfItems,
    //subTotal = orderSummaryData.subTotal,
    //total = orderSummaryData.total,
    //tax= orderSummaryData.tax} = orderSummaryData ? orderSummaryData : useContext(CartContext);

    //const {numberOfItems, subTotal, total, tax} = useContext(CartContext);
    
    return (
    <Grid container>
        <Grid item xs={6}>
            <Typography> No. Productos</Typography>
        </Grid>
        <Grid item xs={6} display='flex' justifyContent='end'>
            <Typography>{summaryValues.numberOfItems}{summaryValues.numberOfItems > 1 ? ' productos': ' producto'}</Typography>
        </Grid>
        
        <Grid item xs={6}>
            <Typography> SubTotal</Typography>
        </Grid>
        <Grid item xs={6} display='flex' justifyContent='end'>
            <Typography> {currency.format(summaryValues.subTotal)} </Typography>
        </Grid>
        
        <Grid item xs={6}>
            <Typography> Impuestos ({ Number(process.env.NEXT_PUBLIC_TAX_RATE) * 100}%) </Typography>
        </Grid>
        <Grid item xs={6} display='flex' justifyContent='end'>
            <Typography> {currency.format(summaryValues.tax)} </Typography>
        </Grid>
        
        <Grid item xs={6}>
            <Typography variant='subtitle1'> Total: </Typography>
        </Grid>
        <Grid item xs={6} display='flex' justifyContent='end'>
            <Typography variant='subtitle1'> {currency.format(summaryValues.total)} </Typography>
        </Grid>

    </Grid>
  )
}
