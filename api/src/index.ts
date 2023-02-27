import db from "./services/db";
import express from "express";
import bodyparser from "body-parser";
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
 
app.use('/v1.0',router)
 
app.listen(PORT, ()=>{
    console.log(`server is listening  on ${PORT}`);
});
 
module.exports = app;