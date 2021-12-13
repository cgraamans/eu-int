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
  ssl: true,
  port: 8001,
};
const httpOptions = {};
const httpSSLOptions = {
  cert: '/../cert/server.cert',
  key: '/../cert/server.key'
};
const expressSession = { 
  secret: 'keyboard cat', 
  cookie: { maxAge: 60000 }, 
  resave:true, 
  saveUninitialized:false
};

//
// CODE
//

try {

  // initial server
  let httpX:any = http;

  // SSL
  let sslCfg:{cert?:Buffer,key?:Buffer} = {};

  if(httpCfg.ssl){

    sslCfg.cert = fs.readFileSync(__dirname+httpSSLOptions.cert);
    sslCfg.key = fs.readFileSync(__dirname+httpSSLOptions.key);
    Object.assign(httpOptions,sslCfg);
    httpX = https;
  
  } else {

    console.log('[WARNING] NO SSL.')

  }

  // Initialize Express
  const app = express();
  app.set('trust proxy', 1);

  // // Session Middleware
  const sessionMiddleware = session(expressSession);
  
  // // Configuring Express middleware
  app.use(sessionMiddleware);
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  // app.use(helmet());
  // todo: Refused to execute inline script because it violates the following Content Security Policy directive: "script-src 'self'". Either the 'unsafe-inline' keyword, a hash ('sha256-3pskxhpwi4/B4xbqPF/wQDYvvsTxVZESPq4tsHM6vNc='), or a nonce ('nonce-...') is required to enable inline execution.

  app.use(cors());
  app.use(morgan('combined'));

  // Create http server with Express
  const httpServer = httpX.createServer(httpOptions, app);

  //
  // IO
  //

  const io = new ioServer(httpServer, {
    cors: {
      origin: "http://localhost:8080",
      methods: ["GET", "POST"]
    }
  });

  io.use(sharedsession(sessionMiddleware, {
    autoSave:true
  }));

  io.of("/socket").on("connection", (socket) => {
    console.log("socket connected");
  });

  //
  // REST
  //

  app.get('/', (req, res) => {
    res.status(200).json({dt:(new Date()).getTime()});
  });

  // Local Routing
  app.use('/auth',authRoute);
  
  // CLIENT Root
  app.use('/client', express.static(path.join(__dirname, 'client')))

  //
  // SERVER
  //
  
  // Server Error
  httpServer.on("error", () => {
    console.log(`[ERROR] Could not start the app on port ${httpServer}`);
    process.exit();
  });

  // Initialize server
  httpServer.listen(httpCfg.port, () => {
    console.log("[INFO] server starting on port : " + httpCfg.port);
  });

} catch(e) {

  console.log(e);

}