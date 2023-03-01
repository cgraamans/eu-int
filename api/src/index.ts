import db from "./services/db";
import express from "express";
import bodyparser from "body-parser";

import cookieParser from 'cookie-parser';

import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";

import router from "./routes/router";

dotenv.config();

const app = express();
  
const PORT= process.env.PORT;
 
app.use(bodyparser.json());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser()); 

app.use('/v1.0',router);

app.get('/', async (req, res, next)=>{
    res.sendStatus(200);
    next();
});

app.listen(PORT, ()=>{
    console.log(`server is listening on ${PORT}`);
});
 
export default app;