import { Typography } from "@mui/material";
import { ShopLayout } from "../../components/layouts";
import { ProductList } from "../../components/products/ProductList";
import { useProducts } from "../../hooks/useProducts";
import { FullScreenLoading } from "../../components/ui";

function Home() {

  //Manejo de DATA FETCHING
  const { products, isLoading } = useProducts('/products?gender=men');

  return (
    <ShopLayout title={'Teslo-Shop-men'} pageDiscription={'Mejores productos de hombres'}>
      <Typography variant="h1" component='h1'>Tienda</Typography>
       <Typography variant="h2" sx={{ mb: 1}}>Todos los productos para Hombres </Typography>

      {
        isLoading
        ?
        <FullScreenLoading></FullScreenLoading>
        : 
        <ProductList products={ products }></ProductList>
      }
    </ShopLayout>
  )
}

export default Home