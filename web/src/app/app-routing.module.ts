import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginRegisterComponent } from './components/login-register/login-register.component';
import { BlogComponent } from './components/blog/blog.component'
import { HomeComponent } from './components/home/home.component'
import { FeedsComponent } from './components/feeds/feeds.component'
import { EventsComponent } from './components/events/events.component'

const routes: Routes = [
  { path: 'login', component: LoginRegisterComponent },
  { path: '', component: HomeComponent },
  { path: 'blog', component: BlogComponent },
  { path: 'feeds', component: FeedsComponent },
  { path: 'events', component: EventsComponent },
  

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }