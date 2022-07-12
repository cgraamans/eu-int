import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import {SocketService} from './services/socket.service';
import {StoreService} from './services/store.service';

import { AppComponent } from './app.component';

import { JwtModule } from "@auth0/angular-jwt";
import { HttpClientModule } from "@angular/common/http";
import { AppRoutingModule } from './app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';

import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { LoginRegisterComponent } from './components/login-register/login-register.component';
import { BlogComponent } from './components/blog/blog.component';
import { MenuTopComponent } from './components/menu-top/menu-top.component';
import { MenuNavComponent } from './components/menu-nav/menu-nav.component';
import { HomeComponent } from './components/home/home.component';
import { EventsComponent } from './components/events/events.component';
import { FeedsComponent } from './components/feeds/feeds.component';
import { HomeEventsComponent } from './components/home-events/home-events.component';
import { HomeBlogComponent } from './components/home-blog/home-blog.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';

export function tokenGetter() {
  return localStorage.getItem("access_token");
}

const config: SocketIoConfig = {
	url: "//192.168.178.14:3000", // socket server url;
	options: {
		// transports: ['websocket']
	}
}

@NgModule({
  declarations: [
    AppComponent,
    LoginRegisterComponent,
    BlogComponent,
    MenuTopComponent,
    MenuNavComponent,
    HomeComponent,
    EventsComponent,
    FeedsComponent,
    HomeEventsComponent,
    HomeBlogComponent,
    SidebarComponent
  ],
  imports: [
    BrowserModule,
    // HttpClientModule,
    // JwtModule.forRoot({
    //   config: {
    //     tokenGetter: tokenGetter,
    //     allowedDomains: ["http://pluto:8001"],
    //     // disallowedRoutes: ["http://example.com/examplebadroute/"],
    //   },
    // }),
    ReactiveFormsModule,
    AppRoutingModule,
    SocketIoModule.forRoot(config),
    
  ],
  providers: [
    SocketService,
    StoreService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
