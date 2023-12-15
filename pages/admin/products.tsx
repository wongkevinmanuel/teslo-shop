import React from 'react'
import useSWR from 'swr';
import { IProduct } from '../../interfaces';
import { AdminLayout } from '../../components/layouts';
import { Box, Button, CardMedia, Grid } from '@mui/material';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { AddOutlined, CategoryOutlined } from '@mui/icons-material';
import Link from 'next/link';


const columns: GridColDef[] = [
    {
        field:'img',
        headerName:'Foto',
        renderCell: (({row}: GridValueGetterParams)=>{
            return ( 
                <a href={`/products/${row.slug}`} target="_blank" rel="noreferrer">
                <CardMedia component='img'
                    alt={ row.title } 
                    className='fadeIn'
                    image={row.img}/>
                </a>)
        })
    },
    { field:'title', headerName:'Titulo', width: 250,
    renderCell: ({row}: GridValueGetterParams) => {
        return (
            <Link href={`/admin/products/${row.slug }`} passHref>
                {row.title}
            </Link>
        )
    } },
    { field:'gender', headerName:'Género'},
    { field:'type', headerName:'Tipo'},
    { field:'inStock', headerName:'Inventario'},
    { field:'price', headerName:'Precio'},
    { field:'sizes', headerName:'Tallas', width: 250},
];

const ProductsPage = () => {
    const  {data, error } = useSWR<IProduct[]>('/api/admin/products');
    if(!data && !error) return (<></>);

    const rows = data!.map(product => ({
        id:     product._id,
        img:    product.images[0],
        title:  product.title,
        gender: product.gender,
        type:   product.type,
        inStock:product.inStock,
        price:  product.price,
        sizes:  product.sizes.join(', '),
        slug:   product.slug
    }));

  return (
    <AdminLayout title={`Productos (${data?.length } )`}
                subTitle={'Mantenimiento de productos'}
                icon={<CategoryOutlined/>}>
        <Box display='flex' justifyContent='end' sx={{mb: 2}}>
            <Button startIcon={ <AddOutlined /> }
                color='secondary'
                href='/admin/products/new'>
                Crear Producto
            </Button>
        </Box>
        <Grid container className='fadeIn'>
            <Grid item xs={12} sx={{height:650, width: '100%'}}>
                <DataGrid rows={rows}
                columns={columns}>
                </DataGrid>
            </Grid>
        </Grid>
    </AdminLayout>
  )
}

export default ProductsPage;