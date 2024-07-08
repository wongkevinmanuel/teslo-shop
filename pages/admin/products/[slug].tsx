import React, {ChangeEvent, FC, useEffect, useRef, useState} from 'react'
import { useForm } from 'react-hook-form';

import { Box, Button, capitalize, Card, CardActions, CardMedia, Checkbox, Chip, Divider, FormControl, FormControlLabel, FormGroup, FormLabel, Grid,  Radio, RadioGroup, TextField } from '@mui/material';
import { DriveFileRenameOutline, SaveOutlined, UploadOutlined } from '@mui/icons-material';

import { useRouter } from 'next/router';

import { AdminLayout } from '../../../components/layouts';
import { tesloApi } from '../../../api';
import { IProduct } from '../../../interfaces'

const validTypes = ['shirts','pants','hoodies','hats'];
const validGender = ['men','women','kid','unisex'];
const validSizes = ['XS','S','M','L','XL','XXL','XXXL'];

interface Props{
    product: IProduct;
}

interface FormData {
    //No id if create new product
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

interface Props{
    product: IProduct;
}

const ProductAdminPage:FC<Props> = ({product}) => {
    
    
    const router = useRouter();
    //Mantiene la referencia html al input de imagen
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    //CONTROLAR VALOR DE TAG/ETIQUETA
    const [ newTagValue , setNewTagValue ] = useState('');

    const [isSaving, setIsSaving ] = useState(false);

    //Register el formulario
    //watch: nos pertmie observar los cambios de inputs, forms
    //getValues: optione todo el valor del formulario en el momento de
    //ser llamado
    //setValue: establecer un valor de manera controlada
    //no re-render de react
    const {register, handleSubmit, formState: {errors} , getValues, setValue, watch } = useForm<FormData>({
        defaultValues: product
    });

    //useEffect se dispara cuando el form cambia
    //useEffect afecta cuando watch, setValue cambian

    useEffect( () =>{
        const subscription = watch( (value, {name, type}) => {
            
            if(name === 'title'){
                const newSlug = value.title?.trim()
                    .replaceAll(' ', '_')
                    .replaceAll("'","")
                    .toLocaleLowerCase() ||  '';

                //Establecer la sugerencia del titulo en el slug
                setValue('slug',newSlug);
                
            }
        }); 

        //watch crea un observable
        //crea un objeto que siempre se ejecuta y se escucha
        //cuando ya no se ocupa el wathc/pantalla
        //se debe destruir con 
        return ()=> subscription.unsubscribe();

    }, [watch, setValue])

    const onChangeSize = (size:string) =>{
        //TODO: TALLAS ARRGREGLAR CHECKBOX 
        const currentSizes = getValues('sizes');
        if( currentSizes.includes(size) ){
            return setValue('sizes', 
                currentSizes.filter(s => s !== size), { shouldValidate: true});
        }

        setValue('sizes', [...currentSizes, size], {shouldValidate: true});
    }

    //METODOS PARA CREAR ETIQUETA
    const onNewTag = () => {
                        //TRIM quita cualquier espacion inicio y final
        const newTag = newTagValue.trim().toLocaleUpperCase();
        setNewTagValue('');
        //crear nuevo arreglo de etiquetas tags
        const currentTags = getValues('tags');

        if(currentTags.includes(newTag)){
            return;
        }

        currentTags.push(newTag);

    }
    
    const onDeleteTag = (tag:string)=>{
        const updatedTags = getValues('tags').filter(t => t !== tag);
        setValue('tags', updatedTags, {shouldValidate: true });
    }
    

    const onDeleteImage = ( image:string) => {
        setValue(
            'images',
            getValues('images').filter(img => img !== image),
            { shouldValidate: true }
        )
    }

    //Se dispara cuando se selecciona archivos
    const onFilesSelected = async ({target}: ChangeEvent<HTMLInputElement> ) => {
        
        if(!target.files || target.files.length === 0 ){
            //abrio selector y cancelo
            return;
        }
        console.log("onFileSelected ........ ");
        console.log(target.files);
        
        try{
            for(const file of target.files ){
                
                const formData = new FormData();
                formData.append('file',file);
                const { data } = await tesloApi.post<{message:string}>('/admin/upload', formData);
                console.log(file);
                
                /*formData.append('file',file);
                formData.append('upload_preset','teslo-shop');
                
                //TODO: dispatch setSaving() bloque a los botones, poner la app en estado de carga
                console.log(`Archivo cargado: ${file.name}`)
                console.log(file);
                setValue('images', [...getValues('images'), file.name ], { shouldValidate: true }); 
                
                const { data } = await tesloApi.post<{ message: string}>('/admin/upload', formData);
                console.log( `Image URL: ${data}`);
                setValue('images', [...getValues('images'), data.message ], { shouldValidate: true }); 
                */
            }
        }catch(error){
            console.log({error});
        }
    }

    const onSubmit = async (form: FormData) => {
        let isImagenDisabled: boolean = false;

        /*try{
            if(form.images == null){
                isImagenDisabled = false;
            }
            return alert('Mínimo 2 imagenes');
        }catch(errror){
            isImagenDisabled = true;
        }

        if(isImagenDisabled){
            if (form.images.length < 2 ) {
                return alert('Mínimo 2 imagenes');
            }
        }
        */
        
        //Enviar solo una vez submit
        setIsSaving(true);
        
        try{
            const {data} = await tesloApi({
                url: '/admin/products',
                method: form._id ? 'PUT' : 'POST', // si tenemos un _id, entonces actualizar, si no crear
                data: form
            }) 
            
            console.log({data});

            if(!form._id){
                router.replace(`/admin/products/${form.slug }`);
            }else{
                setIsSaving(false);
            }
        }catch(error){
            console.log(error);
            setIsSaving(false);
        }
    }
    
    return (
    <AdminLayout title={'Producto'}
        subTitle={`${product.title === undefined ? 'Nuevo': 'Editando: ' + product.title}`}
        icon={ <DriveFileRenameOutline/> }>
        <form onSubmit={ handleSubmit(onSubmit )}>
            <Box display='flex' justifyContent='end' sx={{mb: 1 }} >
                <Button 
                    color="secondary"
                    startIcon={<SaveOutlined/>}
                    sx={{width: '150px'}}
                    type="submit"
                    disabled={isSaving} >
                    Guardar
                </Button>
            </Box>
        
        <Grid container spacing={2}>
            {/*DATA*/}
            <Grid item xs={12} sm={6}>
                <TextField 
                    label="Título"
                    variant='filled'
                    fullWidth
                    sx={{mb: 1}}
                    {...register('title',{
                        required: 'Este campo es requerido',
                        minLength: {value: 2, message: 'Mínimo 2 caracteres'}
                    })}
                    error={ !!errors.title}
                    helperText={ errors.title?.message}
                />
                <TextField 
                    label="Descripción"
                    variant="filled"
                    fullWidth
                    multiline
                    sx={{mb: 1}}
                    {...register('description',{
                        required: 'Este campo es requerido',
                    })}
                    error={!!errors.description}
                    helperText={errors.description?.message}
                    />
                <TextField 
                    label="Inventario"
                    type='number'
                    variant="filled"
                    fullWidth
                    sx={{mb: 1}}
                    {...register('inStock',{
                        required: 'Este campo es requerido',
                        min:{value: 0, message: 'Mínimo de valor cero'}
                    })}
                    error={ !!errors.inStock}
                    helperText={ errors.inStock?.message}
                    />
                <TextField 
                    label="Precio"
                    type='number'
                    variant="filled"
                    fullWidth
                    multiline
                    sx={{mb: 1}}
                    {...register('price',{
                        required: 'Este campo es requerido',
                        min:{value: 0, message: 'Mínimo de valor cero'}
                    })}
                    error={ !!errors.price}
                    helperText={errors.price?.message}
                    />
                <Divider sx={{ my: 1}}/>

                <FormControl sx={{mb: 1 }}>
                    <FormLabel>Tipo</FormLabel>
                    <RadioGroup
                        row
                        value={ getValues('type')}
                        onChange={ ({target})=> setValue('type', target.value, {shouldValidate: true }) }
                        >
                        {
                            validTypes.map(option => (
                                <FormControlLabel 
                                    key={option}
                                    value={option}
                                    control={<Radio color='secondary'/>}
                                    label={ capitalize(option)}
                                />
                            ))
                        }
                    </RadioGroup>
                </FormControl>
                <FormControl sx={{ mb: 1 }}>
                    <FormLabel> Género </FormLabel>
                        <RadioGroup 
                            row
                            value={getValues('gender')}
                            onChange={ ({target}) => setValue('gender', target.value, { shouldValidate: true}) } 
                             >
                            {
                                validGender.map(option => (
                                    <FormControlLabel 
                                        key={option}
                                        value={option}
                                        control={<Radio color='secondary'/>}
                                        label={capitalize(option)}    
                                    />
                                ))
                            }
                        </RadioGroup>
                </FormControl>
                <FormGroup>
                    <FormLabel> Tallas </FormLabel>
                    {
                        validSizes.map(size => (
                            <FormControlLabel
                                key={size}
                                control={<Checkbox  checked={getValues('sizes').includes(size)}/>}  
                                label={ size } 
                                onChange={ () => onChangeSize( size )  }
                            />
                        ))
                    }
                </FormGroup>
            </Grid>
            {/* TAGS E IMAGENES */}
            <Grid item xs={12} sm={6}>
                <TextField 
                    label="Slug - URL"
                    variant="filled"
                    fullWidth
                    sx={{ mb: 1 }}
                    { ...register('slug',{
                        required: 'Este campo es requerido',
                        validate: (val) => val.trim().includes(' ') ? 'No puede tener espacios en blanco': undefined
                    })}
                    error={ !!errors.slug}
                    helperText={ errors.slug?.message}
                />
                <TextField 
                    label="Etiquetas"
                    variant="filled"
                    fullWidth
                    sx={{mb: 1 }}
                    helperText="Presiona [spacebar] para agregar"
                    value={newTagValue}
                    onChange={ ({target})=> setNewTagValue(target.value) }
                    onKeyUp={ ({code}) => code === 'Space' ? onNewTag(): undefined }
                    />
                <Box sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    listStyle: 'none',
                    p: 0,
                    m: 0,
                    }}
                component="ul">
                    {
                        getValues('tags')?.map((tag) => {
                            return (
                                <Chip
                                    key={tag}
                                    label={tag}
                                    onDelete={() => onDeleteTag(tag)}
                                    color='primary'
                                    size='small'
                                    sx={{ ml:1, mt:1}}
                                />
                            )
                        })
                    }
                </Box>

                {/* IMAGENES */}
                <Divider sx={{ my: 2 }}/>
                <Box display='flex' flexDirection='column'>
                    <FormLabel sx={{ mb:1}}>Imágenes</FormLabel>
                    <Button 
                        color='secondary'
                        fullWidth
                        startIcon ={ <UploadOutlined/>} 
                        sx={{ mb:3 }}
                        onClick={()=> fileInputRef.current?.click()} >
                        Cargar Imagen
                    </Button>
                    <input 
                        ref={ fileInputRef}
                        type='file'
                        multiple
                        accept='image/png, image/gif, image/jpeg'
                        style={{display: 'none'}}
                        onChange={ onFilesSelected}
                    />
                    <Chip
                        label="Es necesario 2 imagenes"
                        color='error'
                        variant='outlined'
                        sx={{display: getValues('images').length < 2 ? 'flex': 'none'}}
                    />

                    <Grid container spacing={2}>
                        {
                            getValues('images')?.map(img => (
                                <Grid item xs={4} sm={3} key={img}>
                                    <Card>
                                        <CardMedia
                                            component='img'
                                            className='fadeIn'
                                            image={img}
                                            alt={img}
                                        />
                                        <CardActions>
                                            <Button 
                                                fullWidth
                                                color='error'
                                                onClick={()=> onDeleteImage(img)}>
                                                Borrar
                                            </Button>
                                        </CardActions>
                                    </Card>
                                </Grid>
                            ))
                        }
                    </Grid>
                </Box>
            </Grid> 
            
        </Grid>
     </form>               
    </AdminLayout>
  )
}

// Deberías usar getServerSideProps cuando:
// - Sólo si necesita renderizar previamente 
//una página cuyos datos deben recuperarse en 
//el momento de la solicitud

import {GetServerSideProps} from 'next';
import { Product } from '../../../models';
import { dbProducts } from '../../../database';

export const getServerSideProps: GetServerSideProps = async ({query}) => {

    const {slug = '' } = query;

    let product: IProduct | null;

    if( slug === 'new' ){
        //Crear producto
        const tempProduct = JSON.parse( JSON.stringify(new Product() ));
        //eliminar propiedad _id
        delete tempProduct._id;
        tempProduct.images = ['img1.jpg', 'img2.jpg'];
        product = tempProduct;

    } else{
        product = await dbProducts.getProductBySlug( slug.toString() );
    }

    if( !product ){
        return {
            redirect: {
                destination: '/admin/products',
                permanent: false,
            }
        }
    }
    return {
        props: {
            product
        }
    }
}

export default ProductAdminPage;