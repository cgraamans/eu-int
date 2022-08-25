import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Socket } from 'ngx-socket-io';  

import { StoreService } from "./store.service";

@Injectable({
  providedIn: 'root',
})
export class SocketService   {

  constructor(public store:StoreService, public socket:Socket) {
    socket.on("connect", () => {
      console.log("connected"); // x8WIv7-mJelg7on_ALbx
    });

    socket.on("connect_error", (err:any) => {
      console.log(`connect_error due to ${err.message}`);
    });
    this.socket.emit("items",{});
    this.socket.emit("session_resume",{token:this.store.getToken().length > 0 ? this.store.getToken() : null });

    this.socket.emit("index",{});

    this.socket.emit("news",{source:"EUNews",from:"abcdefgh"});

    this.socket.on("session_token",((data:any)=>{

      // logged in
      console.log("session_token",data.id);
      this.store.setToken(data.id);

    }));

  }

  fetchNews(orderBy:string = "hot") {
    this.socket.emit('items',{token:"xyz",orderBy:orderBy});
  }

  onFetchItems() {
    return this.socket.fromEvent('items');
  }

  // public sendMessage(message:any) {
  //   this.socket.emit('message', message);
  // }

  // public getNewMessage = () => {
  //   this.socket.on('message', (message) =>{
  //     this.message$.next(message);
  //   });
    
  //   return this.message$.asObservable();
  // };

}