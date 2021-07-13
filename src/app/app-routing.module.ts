import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/student/home/home.component';
import { RegisterComponent } from './components/register/register.component';
import { LabmemberComponent } from './components/lab-member/labmember/labmember.component';
import { LabSquadComponent } from "./components/labsquad/lab-squad/lab-squad.component";
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { AdminHomeComponent } from './components/admin/admin-home/admin-home.component';
const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'forgotpassword',
    component: ForgotPasswordComponent,
  },
  {
    path: 'shome',
    component: HomeComponent,
  },
  {
    path: 'admin',
    component: AdminHomeComponent,
  },
  {
    path: 'labmember',
    component: LabmemberComponent,
  },
  {
    path: 'labsquad',
    component: LabSquadComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
