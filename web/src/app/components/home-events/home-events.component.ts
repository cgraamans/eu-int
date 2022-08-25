import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'home-events',
  templateUrl: './home-events.component.html',
  styleUrls: ['./home-events.component.scss']
})
export class HomeEventsComponent implements OnInit {

  constructor() { }

  public mock = [

    {
      img:"http://localhost:4200/assets/logos/top.png",
      user:"meet-eu",
      summary:"Meet MEPs from Renew!",
      description:`Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin suscipit libero non sem bibendum pretium. Phasellus ut ultrices dui. Nam euismod luctus odio in tincidunt.`,
      link:"https://meeteu.eu"
    },
    {
      img:"http://localhost:4200/assets/logos/top.png",
      user:"into-europe",
      summary:"New Video!",
      description:`Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin suscipit libero non sem bibendum pretium.\n\n 
      Phasellus ut ultrices dui. Nam euismod luctus odio in tincidunt.`,
      link:"https://meeteu.eu"
    },
    {
      img:"http://localhost:4200/assets/logos/top.png",
      user:"imperial",
      summary:"LOREM IPSUM",
      description:`Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin suscipit libero non sem bibendum pretium. Phasellus ut ultrices dui. Nam euismod luctus odio in tincidunt.`,
      link:"https://meeteu.eu"

    },
    {
      img:"http://localhost:4200/assets/logos/top.png",
      user:"hoog",
      summary:"LOREM IPSUM",
      description:`Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin suscipit libero non sem bibendum pretium. Phasellus ut ultrices dui. Nam euismod luctus odio in tincidunt.`,
      link:"https://meeteu.eu"
    },
    {
      img:"http://localhost:4200/assets/logos/top.png",
      user:"mepassistant",
      summary:"LOREM IPSUM",
      description:`Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin suscipit libero non sem bibendum pretium. Phasellus ut ultrices dui. Nam euismod luctus odio in tincidunt.`,
      link:"https://meeteu.eu"
    },

  ];

  ngOnInit(): void {
  }

}
