import { Box, Typography } from "@mui/material";
import { ShopLayout } from "../../components/layouts";
import { ProductList } from "../../components/products/ProductList";
import { GetServerSideProps, NextPage } from 'next'
import { dbProducts } from "../../database";
import { IProduct } from "../../interfaces";

interface Props{
  products: IProduct[];
  foundProducts: boolean;
  query: string;
}

const SearchPage: NextPage<Props> = ({ products , foundProducts, query}) => {
 
  return (
    <ShopLayout title={'Teslo-Shop SearchPage'} pageDiscription={'Mejores productos'}>
      <Typography variant="h2" component='h1'> Buscar Producto:</Typography>
      {
        foundProducts ? 
          <Typography variant="h2" sx={{mb: 1}}  textTransform="capitalize">Término: {query}</Typography>
        : 
          (
            <Box display='flex'>
              <Typography variant="h2" sx={{mb: 1}}>No encontramos ningún producto: </Typography>
              <Typography variant="h2" sx={{mb: 1}} color='secondary' textTransform="capitalize"> {query} </Typography>
            </Box>
          )
      }
      <ProductList products={ products }></ProductList>
    </ShopLayout>
  )
}


//Deberías usar getServerSideProps cuando:
//Solo si necesita renderizar previamente una página 
//cuyos datos deben recuperarse en el momento de la solicitud
//desestructurar params de ctx
export const getServerSideProps: GetServerSideProps = async ({params}) => {
  const { query = '' } = params as { query: string};

  if(query.length === 0){
    return {
      redirect: {
        destination: '/',
        permanent: true
      }
    }
  }
  // y no hay products
  let products = await dbProducts.getProductByTerm(query);
  const foundProducts = products.length > 0 ;
  // TODO: retornar otros productos 
  if(!foundProducts){
    products = await  dbProducts.getAllProducts();
  }

  return {
    props: {
      products,
      foundProducts,
      query
    }
  }
}

export default SearchPage