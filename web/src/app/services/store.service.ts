import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  private token:BehaviorSubject<string> = new BehaviorSubject('')

  constructor() { 

    const localToken = localStorage.getItem('_token');  
    if(localToken){
      this.token.next(localToken);
    } 

    this.token.subscribe((storedToken=>{
      if(storedToken) localStorage.setItem('_token',storedToken);
    }))

    // Nav retrieval (json)

    // Color retrieval

  }

  public getToken() {

    return this.token.getValue();

  }

  public setToken(token:string) {

    this.token.next(token);

  }

  public getTokenAsObservable() {

    return this.token.asObservable();
  
  }

}