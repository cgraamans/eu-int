import Joi from "joi";

import {eventBuilder} from "../lib/tools";

import {EUINT} from "../../types";



module.exports = {

    run: async (socket:EUINT.ExtendedSocket,event:string,args:{orderBy?:string,limit?:number,orderDir?:string})=>{

        const socketList = eventBuilder(__dirname)
        console.log(socketList);

        return socket;

    }

}


// export default (io) => {
//     const fs = require("fs")
//     const path = require("path")
  
//     // Full path to the current directory
//     const listenersPath = path.resolve(__dirname)
  
//     // Reads all the files in a directory
//     fs.readdir(listenersPath, (err, files) => {
//       if (err) {
//         process.exit(1)
//       }
  
//       files.map((fileName) => {
//         if (fileName !== "index.js") {
//           console.debug("Initializing listener at: %s", fileName)
//           // Requires all the files in the directory that is not a index.js.
//           const listener = require(path.resolve(__dirname, fileName))
//           // Initialize it with io as the parameter.
//           listener(io)
//         }
//       })
//     })
//   }

