declare module 'node:http' {
  interface IncomingMessage {
    session: string
  }
}
declare module "socket.io" {
  interface Socket {
    decoded: {
      userId: number;
    };
  }
}

//
// MODULES
//
import express from "express";
import session from "express-session";

import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import * as http from 'http'
import * as https from 'https';
import { Server as ioServer } from 'socket.io';
import fs from "fs";
import path from "path";
import sharedsession from "express-socket.io-session";

// local modules
import {route as authRoute} from "./routes/auth";

//
// CONFIG
// todo: move

const httpCfg = {
  ssl: false,
  port: 8001,
};
const httpOptions = {};
const httpSSLOptions = {
  key: 'cert/ssl.key',
  cert: 'cert/ssl.crt'
};

//
// CODE
//

try {
  
  let sslCfg:{key?:Buffer,cert?:Buffer} = {};

  // SSL
  const httpX = (httpCfg.ssl) ? https : http;
  if(httpCfg.ssl){
    sslCfg.key = fs.readFileSync(sslCfg.key);
    sslCfg.cert = fs.readFileSync(sslCfg.cert);
  }
  const httpServOptions = (httpCfg.ssl) ? Object.assign(sslCfg,httpOptions) : httpOptions;

  // Session Middleware
  const sessionMiddleware = session({ secret: 'keyboard cat', cookie: { maxAge: 60000 }});


  // Initialize Express
  const app = express();

  // Configuring Express middleware
  app.use(sessionMiddleware);
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(helmet());
  app.use(cors());
  app.use(morgan('combined'));

  // Local Routing
  app.use('/auth',authRoute);

  // Create http server with Express
  const httpServer = httpX.createServer(httpServOptions, app);

  // Initialize ioServer
  const io = new ioServer(httpServer);

  io.use(sharedsession(sessionMiddleware, {
    autoSave:true
  }));

  // io Events
  io.on("connection", (socket) => {
    console.log("socket connected");
  });

  // REST Root 
  app.get('/', (req, res) => {
    res.status(200).json({dt:(new Date()).getTime()});
  });

  // CLIENT Root
  app.use('/client', express.static(path.join(__dirname, 'client')))

  // Initialize server
  httpServer.listen(httpCfg.port, () => {
    console.log("server starting on port : " + httpCfg.port);
  });

} catch(e) {

  console.log(e);

}