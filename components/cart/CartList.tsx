import React, {FC, useContext} from 'react' 
import NextLink from 'next/link';
import { CardActionArea, CardMedia, Grid, Typography, Link, Box, Button } from '@mui/material'

import { ItemCounter } from '../ui';
import CartContext from '../../context/cart/CartContext';
import { ICartProduct, IOrderItem } from '../../interfaces';

interface Props{
    children?: React.ReactNode;
    editable?: boolean;
    products?: IOrderItem[];
}

/*TODO: updatedQuantity agregar el metodo del componente <ItemCounter></ItemCounter> */
export const CartList:FC<Props> = ({editable = false, products}) => {
//export const CartList:FC<Props> = ({editable = false, products= []}) => {
    
    const {cart} = useContext(CartContext);

    const {updateCartQuantity } = useContext(CartContext);
    const {removeCartProduct } = useContext(CartContext);
    
    
    const onNewCartQuantityValue = (product: ICartProduct ,newQuantityValue: number ) => {
        product.quantity = newQuantityValue;
        updateCartQuantity(product);
    }
    
    const productsToShow = products ? products : cart;

    return (
    <>
        {
            productsToShow.map(
            product => (
               <Grid container spacing={2} key={product.slug + product.size } sx={{ mb:1}}>
                <Grid item xs={3}>

                    <Link href={`/products/${product.slug}`} component={NextLink}>
                        <CardActionArea>
                            <CardMedia
                            image={product.image}
                            component='img'
                            sx={{borderRadius:'5px'}}/>
                        </CardActionArea>
                    </Link>
                </Grid>
                <Grid item xs={7}>
                    <Box display='flex' flexDirection='column'>
                        <Typography variant='body1'>{product.title}</Typography>
                        <Typography variant='body1'>Talla:<strong> {product.size} </strong></Typography>
                        {
                            editable ?
                            (
                                <ItemCounter currentValue={product.quantity} 
                                    maxValue={10} 
                                    updatedQuantity={ (newValue)=> onNewCartQuantityValue(product as  ICartProduct, newValue) } />
                            ) 
                            :
                            (
                                <Typography variant='h5'>
                                    {product.quantity}
                                    {product.quantity >1? 'productos': 'producto'} 
                                </Typography>
                            )
                        }
                    </Box>
                </Grid>
                <Grid item xs={2} display='flex' alignItems='center' flexDirection='column'>
                    <Typography variant='subtitle1'>{`${product.price}`}</Typography>
                    {
                        editable && (
                            <Button variant='text' color='secondary'
                            onClick={() => removeCartProduct(product as  ICartProduct)}>
                                Remover
                            </Button>
                        )
                    }
                </Grid>
               </Grid>
                )
            )
        }
    </>
  )
}
