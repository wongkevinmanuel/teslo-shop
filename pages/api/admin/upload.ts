import type { NextApiRequest, NextApiResponse } from 'next' 
import { v2 as cloudinary } from 'cloudinary';

import formidable, {File}  from 'formidable';
import fs from 'fs';
import path from 'path';

cloudinary.config({
        cloud_name: process.env.CLOUDINARY_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
        url: process.env.CLOUDINARY_URL || ''
});

type Data = {
    message: string | undefined 
}

export const config = {
    api: {
        bodyParser: false,
    }
}

export default function handler(req: NextApiRequest
    , res: NextApiResponse<Data>) {

        switch(req.method){
            case 'POST':
                return UploadFile(req, res);
            default:
                res.status(400).json({ message: 'Bad request' })
        }
}

const saveFile = async (file: formidable.File ): Promise<string> =>{
    const {secure_url } = await cloudinary.uploader.upload(file.filepath);
    return secure_url;
}

type ProcessedFiles = Array<[string ,File]>;
let status = 200;
let resultBody = { status: 'ok', message: 'Files were uploaded successfully' };


const parseFiles = async(req:NextApiRequest) => {
console.log("upload.... file....");

    const files = await new Promise<ProcessedFiles | undefined >( (resolve, reject )=> {
            const form = new formidable.IncomingForm();
            const files: ProcessedFiles = [];

            form.on( 'file',function(field, file){
                    files.push([field, file ]);
                });
            form.on('end', ()=>  resolve(files));
            form.on('error', err =>reject(err));
            form.parse(req, ()=> { 
                //
            });
    }).catch(e => {
        console.log(e);
        status = 500;
        resultBody = {status:'fail', message:'Upload error' };
    });

    if(files?.length === 0){
        return '';
    }
    
    for(const file of files!){
        const filePath = await saveFile(file[1]);
        return filePath;
    }

    /* return new Promise( (resolve, reject )=> {
            const form = new formidable.IncomingForm();
                form.parse( req, async(err:any, fields:formidable.Fields, files:formidable.Files ) => {
                        if(err)
                            return reject(err);
                        
                        const filePath = await saveFile(files.file )//as formidable.File )
                        resolve(filePath);
                    }
            );
        }
    ); */
}

const UploadFile = async (req: NextApiRequest, res: NextApiResponse<Data>)=>{
    const imageUrl: string | undefined  = await parseFiles(req);

    return res.status(200).json({ message: imageUrl  });
}
