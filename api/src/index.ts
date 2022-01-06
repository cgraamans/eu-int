
//
// MODULES
//
import express from "express";

import cors from "cors";
import morgan from "morgan";
import * as http from 'http'
import * as https from 'https';
import { Server as ioServer } from 'socket.io';
import fs from "fs";
import path from "path";

// Types
import {EUINT} from "../types";

// local modules
import Session from "./lib/session";

//
// CONFIG
// todo: move

const httpCfg = {
  ssl: false,
  port: 8001,
};
const httpOptions = {};
const httpSSLOptions = {
  cert: '/../cert/server.cert',
  key: '/../cert/server.key'
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
  app.use(cors());
  app.use(morgan('combined'));

  // Create http server with Express
  const httpServer = httpX.createServer(httpOptions, app);

  //
  // IO
  //

  const io = new ioServer(httpServer, {
    cors: {
      origin: "http://pluto:4200",
      methods: ["GET", "POST"]
    }
  });

  io.on("connection", (socket:EUINT.ExtendedSocket) => {
 
    // generate session
    socket.session = new Session();
    
    socket.on("user:token",(...args)=>{

      if(args.length !== 1) return;
      // check for token validity

      console.log(args);
      
      //
      socket.emit("user:login",{ok:true})

    });

    socket.onAny((eventName, ...args)=>{

      console.log(eventName,args);

    });
    
    console.log("socket connected");
    console.log("socket session",socket.session);

  });

  //
  // REST
  //

  // CLIENT Root
  app.use('/', express.static(path.join(__dirname, 'client')))

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