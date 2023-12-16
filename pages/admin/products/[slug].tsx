import React, {FC} from 'react'
import { IProduct } from '../../../interfaces'



interface Props{
    product: IProduct;
}
const validTypes = ['shirts','pants','hoodies','hats'];
const validGender = ['men','women','kid','unisex'];
const validSizes = ['XS','S','M','L','XL','XXL','XXXL'];

interface FormData {
    _id?        : string;
    description : string;
    images      : string[];
    inStock     : number;
    price       : number;
    sizes       : string[];
    slug        : string;
    tags        : string[];
    title       : string;
    type        : string;
    gender      : string;
}

const ProductAdminPage:FC<Props> = ({product}) => {
    

    
    return (
    <div> ProductAdminPage: </div>
  )
}

export default ProductAdminPage;