import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import {ws,wss} from "websocket";
import * as http from 'http'
import * as https from 'https'



const ads = [
    {title: 'Hello, world (again)!'}
  ];

const app = express();
const port = 3000;

// Configuring middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(helmet());

app.use(cors());

app.use(morgan('combined'));



app.get('/', (req, res) => {
    res.send(ads);
  });
  
  // starting the server
  app.listen(port, () => {
    console.log((new Date()),`listening on port ${port}`);
  });