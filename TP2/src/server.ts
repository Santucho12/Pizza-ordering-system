import { makeApp } from './app';
import dotenv from 'dotenv'
dotenv.config()

const PORT: number = Number(process.env.PORT) || 3000;

makeApp().listen(PORT, () => {
    console.log(`Servidor corriendo en ${process.env.HOST || 'http://localhost'}:${PORT}`)
});
