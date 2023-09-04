import { Typography } from "@mui/material";
import { ShopLayout } from "../../components/layouts";
import { ProductList } from "../../components/products/ProductList";
import { useProducts } from "../../hooks/useProducts";
import { FullScreenLoading } from "../../components/ui";

function HomeWomen() {

  //Manejo de DATA FETCHING
  const { products, isLoading } = useProducts('/products?gender=women');

  return (
    <ShopLayout title={'Teslo-Shop-women'} pageDiscription={'Mejores productos de mujeres'}>
      <Typography variant="h1" component='h1'>Tienda</Typography>
       <Typography variant="h2" sx={{ mb: 1}}>Todos los productos para mujeres </Typography>

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

export default HomeWomen