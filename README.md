
## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

# Next.js TESLO-SHOP
Para ejecutar la app localmente:
Objetos necesarios:
Base de datos
```
docker-compose up -d
```

* El -d, significa __detached__
* No se quiere que siga ejecutando en la consola

Mongo URL Local:
```
mongodb://localhost:27017/teslodb
```

##Configurar las variables de entorno
Renombrar el archivo __.env.template__ a __.env__
Y las siguientes variables:
SECRET_KEY=
MONGO_URL=
NEXT_PUBLIC_CLIENT_KEY=

##Llenar la base  de datos con informacion de prueba 
llamar: 
```
http://localhost:3000/api/XXXXX
```

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
