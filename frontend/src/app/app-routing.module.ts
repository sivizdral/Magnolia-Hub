import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminLoginComponent } from './admin/admin-login/admin-login.component';
import { AdminUserCreateComponent } from './admin/admin-user-create/admin-user-create.component';
import { AdminUserListComponent } from './admin/admin-user-list/admin-user-list.component';
import { AllWorkshopsComponent } from './all-workshops/all-workshops.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { PasswordChangeComponent } from './password-change/password-change.component';
import { PasswordResetComponent } from './password-reset/password-reset.component';
import { RegisterComponent } from './register/register.component';
import { TopComponent } from './top/top.component';
import { WorkshopSingleComponent } from './workshop-single/workshop-single.component';

const routes: Routes = [
  {path: "", component: HomeComponent},
  {path: "top", component:TopComponent},
  {path: "all-workshops", component: AllWorkshopsComponent},
  {path: "login", component: LoginComponent},
  {path: "signup", component: RegisterComponent},
  {path: "password-reset/:userId/:token", component:PasswordResetComponent},
  {path:"passch", component:PasswordChangeComponent},
  {path: "admin/login", component: AdminLoginComponent},
  {path: "admin/user-create", component: AdminUserCreateComponent},
  {path: "admin/user-listing", component: AdminUserListComponent},
  {path: "workshop-details", component: WorkshopSingleComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
