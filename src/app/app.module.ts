import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './components/login/login.component';
import { AppMaterial } from './app-material.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ApiService } from 'src/app/shared-modules/api.service';
import { RegisterComponent } from './components/register/register.component'
import { HomeComponent } from './components/student/home/home.component';
import { RaiseTicket } from './components/student/home/raiseTicket/raiseTicket.component';
import { ViewAssignTicketComponent } from './components/labsquad/view-assign-ticket/view-assign-ticket.component';
import { LabmemberComponent } from './components/lab-member/labmember/labmember.component';
import { LabSquadComponent } from './components/labsquad/lab-squad/lab-squad.component';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    LabmemberComponent,
    RegisterComponent,
    RaiseTicket,
    ViewAssignTicketComponent,
    LabSquadComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AppMaterial,
    HttpClientModule
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: ApiService, multi: true }],
  bootstrap: [AppComponent],
  entryComponents: [RaiseTicket]
})
export class AppModule { }
