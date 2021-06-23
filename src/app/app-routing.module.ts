import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/student/home/home.component';
import { RegisterComponent } from './components/register/register.component';
import { LabMemberComponent } from './components/labmember/labmember-screen/labmember.component';
import { LabsquadComponent } from './components/labsquad/labsquad/labsquad.component';

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
    path: 'shome',
    component: HomeComponent,
  },
  {
    path: 'labmember',
    component: LabMemberComponent,
  },
  {
    path: 'labsquad',
    component: LabsquadComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
