import { FC , useState, useMemo }from 'react'
import NextLink from 'next/link';

import { Link, Box, Card, CardActionArea, CardMedia, Grid, Typography, Chip, IconButton, Badge } from '@mui/material';
import { IProduct } from '../../interfaces';

interface Props{
    product: IProduct,
    children?: React.ReactNode;
}

export const ProductCard:FC<Props> = ({product}) => {
  
  //Efecto de imagen sobre producto seleccionado
  //Definir acciones cuando el mouse esta entrando a la 
  //img y cuando el mouse no esta en la img
  const [isHovered, setIsHovered] = useState(false);

  //useMemo para memorizar el product img, para no 
  //volver a calcular
  const productImage = useMemo(() => {
    // las '/'
    return isHovered
    ? product.images[1]
    : product.images[0]
  }, [isHovered, product.images])

  //METODOS PARA CARGAR TEXTOS Y 
  //IMAGENES AL TIEMPO, NO SUPER MONTADO
  const[isImageLoaded, setIsImageLoaded] = useState(false);
  /*  desactivar el prefetch de next */
  return (
          <Grid item xs={6} 
          sm={4}
          onMouseEnter={()=> {setIsHovered(true)}}
          onMouseLeave={()=> {setIsHovered(false)}}>

            <Card>
              <Link component={NextLink} href={`/products/${product.slug}`} prefetch={false}>
                <CardActionArea>
                  {
                    (product.inStock === 0) && (
                      <Chip 
                      color='primary' label='No disponibles'
                      sx={{position:'absolute', zIndex: 99, top:'10px',left: '10px'}}></Chip>
                      )
                  }
                  
                  <CardMedia
                    className='fadeIn'
                    component='img'
                    image={productImage}
                    alt={product.title}
                    //onLoad se dispara cuando el recurso se carga
                    //se establece que la imagen se cargo
                    onLoad={()=> setIsImageLoaded(true)}>
                  </CardMedia>
                </CardActionArea>
              </Link>
            </Card>
            {/* SI LA IMAGEN NO ESTA CARGADA NO SE MUESTRA */} 
            <Box sx={{ mt:1,
               display: isImageLoaded? 'block': 'none'}} 
               className='fadeIn'>
                <Typography fontWeight={700}>{ product.title}</Typography>
                <Typography fontWeight={500}> { `$${product.price}`}</Typography>
            </Box>
          </Grid>
  )
}
