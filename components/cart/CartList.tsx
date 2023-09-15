
import React, {FC, useContext} from 'react'
import { initialData } from '../../database/products'
import { CardActionArea, CardMedia, Grid, Typography, Link, Box, Button } from '@mui/material'
import NextLink from 'next/link';
import { ItemCounter } from '../ui';
import CartContext from '../../context/cart/CartContext';



interface Props{
    editable ?: boolean;
    children ?: React.ReactNode
}
/*TODO: updatedQuantity agregar el metodo del compoenete <ItemCounter></ItemCounter> */
export const CartList:FC<Props> = ({editable = false}) => {
    const {cart} = useContext(CartContext);
    return (
    <>
    {
        cart.map(
            product => (
               <Grid container spacing={2} key={product.slug} sx={{ mb:1}}>
                <Grid item xs={3}>
                    {/* TODO: llevar a la pagina del producto */}
                    <Link href='/product/slug' component={NextLink}>
                        <CardActionArea>
                            <CardMedia
                            image={`/products/${product.image}`}
                            component='img'
                            sx={{borderRadius:'5px'}}></CardMedia>
                        </CardActionArea>
                    </Link>
                </Grid>
                <Grid item xs={7}>
                    <Box display='flex' flexDirection='column'>
                        <Typography variant='body1'>{product.title}</Typography>
                        <Typography variant='body1'>Talla:<strong>M</strong></Typography>
                        {
                            editable ?
                            <ItemCounter currentValue={1} maxValue={5} updatedQuantity={ true }/> :
                            <Typography variant='h5'>3 items</Typography>
                        }
                    </Box>
                </Grid>
                <Grid item xs={2} display='flex' alignItems='center' flexDirection='column'>
                    <Typography variant='subtitle1'>{`${product.price}`}</Typography>
                    
                    {
                        editable && (
                            <Button variant='text' color='secondary'>
                                Remover
                            </Button>
                        )
                    }
                </Grid>
               </Grid>
            )
        )
    }</>
  )
}
