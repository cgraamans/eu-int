import {Socket} from "socket.io";
import {Session} from "./lib/session.ts";

export namespace EUINT{

  interface User {
    id:number,
    name:string,
    nickname:string,
  }

  interface ExtendedSocket extends Socket {
    session:Session;
  }
  
}

