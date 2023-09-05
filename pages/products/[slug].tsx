import { FC, useState } from 'react';
import { ShopLayout } from '../../components/layouts';
import { Box, Button, Chip, Grid, Typography } from '@mui/material';
import {ProductSlideshow, SizeSelector } from '../../components/products';
import { ItemCounter } from '../../components/ui';
import { ICartProduct, IProduct, ISize } from '../../interfaces';
import { GetServerSideProps, GetStaticPaths, GetStaticProps } from 'next';
import { dbProducts } from '../../database';

interface Props{
    product: IProduct
}

const ProductPage:FC<Props> = ({product}) => {
    /* M1: PARA CARGAR COMPONENTE, SE COLOCA LOADING
        PARA VOLVER HACER LA REQUEST AL BACKEND
        PARA TRAER INFO PRODUCTS Y RENDERICE
        PROBLEMA ES QUE NO SE TIENE CEO ERRORRRRR
    const router = useRouter();
    const { products: product, isLoading } = useProducts(`/products/${ router.query.slug }`);
    if(isLoading) {
        return <h1>Cargando...</h1>;
    }
    if(!product){
        <h1>No existe producto.</h1>
    } */

    /* PAGINA PREGENERADA DEL LADO DEL SERVIDOR */
    //Tener estado local de la pagina
    //products por slock
    const [temCartProduct, setTemCartProduct] = useState<ICartProduct>({
        //products siempre generado del lado del servidor
        _id:product._id,
        image: product.images[0],
        price: product.price,
        size: undefined,
        slug: product.slug,
        title:product.title,
        gender: product.gender,
        quantity: 1
    });

    const selectedSize = ( size: ISize) => {
        console.log(size);
        setTemCartProduct( currentproduct => ({
            //desestructuracion 
            ...currentproduct,
            size: size
        }));
    }

    return (
    <ShopLayout title={product.title} pageDiscription={product.description}>
        <Grid container spacing={3}>
            <Grid item xs={12} sm={7}>
                <ProductSlideshow 
                images={product.images}>
                </ProductSlideshow>
            </Grid>
            <Grid item xs={12} sm={5}>
                <Box display='flex' flexDirection='column'>

                    <Typography variant='h1' component='h1'>
                        {product.title}
                    </Typography>
                    <Typography variant='h2' component='h2'>
                        {product.price}
                    </Typography>
                    
                    <Box sx={{ my: 2}}>
                        <Typography variant='subtitle2'>Cantidad</Typography>
                        <ItemCounter/>

                        <SizeSelector sizes={product.sizes}
                         selectedSize={temCartProduct.size}
                         onSelectedSize={ (size) => selectedSize(size)}
                         />
                    </Box>
                    {/* onSelectedSize={ selectedSize(size)} */}
                    {/*Agregar al carrito */}
                    {
                        (product.inStock > 0 )? (
                            <Button color="secondary" className='circular-btn'>
                                {
                                    temCartProduct.size ?
                                    'Agregar al carrito'
                                    : 'Seleccione una talla'
                                }   
                            </Button>
                        ):(
                            <Chip
                            label="No disponible" color='error' variant='outlined'
                            ></Chip>
                        )

                    }

                    {/*Descripcion */}
                    <Box sx={{ mt: 3}}>
                        <Typography variant='subtitle2'> Descripcion</Typography>
                        <Typography variant='body2'> {product.description}</Typography>
                    </Box>
                </Box>
            </Grid>
        </Grid>
    </ShopLayout>
  )
}

/*
//M2: PAGINA PREGENERADA DEL LADO DEL SERVIDOR con getServerSideProps
export const getServerSideProps: GetServerSideProps = async (ctx) =>{

    //Obtener el slug del contexto
    const { slug = ''} = ctx.params as { slug:string };

    const productsss = await dbProducts.getProductBySlug(slug); 
    //TODO sin el await falla xq??

    //si el producto no existe = !productsss
    if(productsss == null){
        return {
            redirect: {
                destination:'/',
                permanent: false 
            }
        }
    }

    //props son eviados al componente
    return { 
        props: {
            product: productsss
        }
    }
}
*/

/* getStaticPaths... 
    getAllProductsSlugs3
    regresa todos los productos de BD.
    Enviar todo los slugs, url al metodo getStaticProps
*/
export const getStaticPaths: GetStaticPaths = async (ctx) => {
    
    //Optiene todos los slugs de los productos de BD
    const productSlugs = await dbProducts.getAllProductSlugs();
    //Crear arreglo para que se vea como
    /* 
        [
            {
                params: {}
            }
        ]
    */

    return{
        paths:  productSlugs.map( 
                    (   {slug}) => ({ params: {slug} }) 
                    ),
        fallback: 'blocking',
    }
}

/* 
Envia al componente ProductPage el producto
getStaticProps... 
Crea de manera estatica todas la pantallas
*/
export const getStaticProps: GetStaticProps = async ({params}) => {
    
    //los getStaticPaths le envian aki los slug
    const {slug = ''} = params as {slug: string};
    const product = await dbProducts.getProductBySlug(slug); 

    //Si no tiene un producto
    if(product == null){
        return {
            redirect: {
                destination:'/',
                permanent: false
            }
        }
    }

    //Se especifica la product
    //y cuando se revalida mediante asignacion de tiempo
    // 60 seg * 60 min * 24 horas
    return{
        props:{
            product: product
        },
        revalidate: 86400
        // Cada 24 horas 60 * 60 * 24
    }
}

export default ProductPage;