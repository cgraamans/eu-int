import { Component, OnInit } from '@angular/core';
import { SocketService } from 'src/app/services/socket.service';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  constructor(private socketService:SocketService) { 

    this.socketService.socket.on("items:new",(data:any)=>{

      console.log(data);

    });

  }

  ngOnInit(): void {

    this.socketService.socket.emit("news:items",{time_created:new Date().getTime(),limit:5});

  }

}
