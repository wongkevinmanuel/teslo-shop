import type { NextApiRequest, NextApiResponse } from 'next'
/* import formidable from 'formidable' */
import fs from 'fs';
import { v2 as cloudinary } from 'cloudinary';
cloudinary.config( process.env.CLOUDINARY_URL || '');

type Data = {
    message: string
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

function UploadFile(req: NextApiRequest, res: NextApiResponse<Data>) {
    throw new Error('Function not implemented.');
}
