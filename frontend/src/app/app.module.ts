import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import {HttpClientModule} from '@angular/common/http';
import { HomeComponent } from './home/home.component';
import { PasswordResetComponent } from './password-reset/password-reset.component';
import { PasswordChangeComponent } from './password-change/password-change.component';
import { TopComponent } from './top/top.component';
import { AdminLoginComponent } from './admin/admin-login/admin-login.component';
import { AdminUserListComponent } from './admin/admin-user-list/admin-user-list.component';
import { AdminWorkshopListComponent } from './admin/admin-workshop-list/admin-workshop-list.component';
import { AdminWorkshopRequestsComponent } from './admin/admin-workshop-requests/admin-workshop-requests.component';
import { AdminUserCreateComponent } from './admin/admin-user-create/admin-user-create.component';
import { AllWorkshopsComponent } from './all-workshops/all-workshops.component'

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    PasswordResetComponent,
    PasswordChangeComponent,
    TopComponent,
    AdminLoginComponent,
    AdminUserListComponent,
    AdminWorkshopListComponent,
    AdminWorkshopRequestsComponent,
    AdminUserCreateComponent,
    AllWorkshopsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
