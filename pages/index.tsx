import { Typography } from "@mui/material";
import { ShopLayout } from "../components/layouts";
import { ProductList } from "../components/products/ProductList";
import { useProducts } from "../hooks/useProducts";
import { FullScreenLoading } from "../components/ui";

import { useSession, signIn, signOut } from "next-auth/react"

function Home() {

  //Manejo de DATA FETCHING
  const { products, isLoading } = useProducts('/products');

  //Session
  const {data: session } = useSession();

  console.log(`Informacion de session:`);
  console.log(session?.user);

  return (
    <ShopLayout title={'Teslo-Shop-Home'} pageDiscription={'Mejores productos'}>
      <Typography variant="h1" component='h1'>Tienda</Typography>
      <Typography variant="h2" sx={{ mb: 1}}>Todos los productos</Typography>

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