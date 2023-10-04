import { FC } from 'react'
import { Grid } from '@mui/material'

import { IProduct } from '../../interfaces';
import { ProductCard } from './ProductCard';

interface Props {
    products: IProduct[];
    children?: React.ReactNode;
}

export const ProductList: FC<Props> = ({products}) => {
  return (
    <Grid container spacing={4}>
        {
          products.map(
              product => (
                  <ProductCard 
                  key={product.slug}
                  product={product}>

                  </ProductCard>)
          )
        }
    </Grid>
  )
}
