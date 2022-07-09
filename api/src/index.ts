//
// MODULES
//
import express from "express";

import * as http from 'http'
import * as https from 'https';
import fs from "fs";
import path from "path";

import cors from "cors";
import morgan from "morgan";
import { Server } from 'socket.io';

import {eventBuilder} from './lib/tools';

// Types
import {EUINT} from "../types";

// local modules
import Session from "./lib/session";

//
// CONFIG
// todo: move

const httpCfg = {
  ssl: false,
  port: 3000,
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
  // app.use(cors());
  // app.use(morgan('combined'));

  // Create http server with Express
  const httpServer = httpX.createServer(httpOptions, app);

  //
  // IO
  //

  const io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:4200", // todo: try *
      methods: ["GET", "POST"]
    },
  });

  io.on("connection", (socket:EUINT.ExtendedSocket) => {
 
    console.log("CONNECTION");

    socket.join("news:new");

    // generate session
    socket.session = new Session();

    const socketList = eventBuilder(__dirname + "/sockets")
    console.log(socketList);

    socket.onAny((eventName, ...args)=>{

      console.log(`ROUTE > ${eventName}`, args);

      const eventPos = socketList.find(x=>x.socket === eventName);
      if(eventPos)  {

        console.log(`ROUTE >> ${eventName}`, eventPos);

        const event = require(eventPos.file);
        socket = event.run(socket,eventName,args);
      
      }

      console.log(eventName,args);

      return;

    });
    
    console.log("socket connected");
    console.log("socket session",socket.session);

    return;

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