import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminLoginComponent } from './admin/admin-login/admin-login.component';
import { AdminUserCreateComponent } from './admin/admin-user-create/admin-user-create.component';
import { AdminUserListComponent } from './admin/admin-user-list/admin-user-list.component';
import { AdminUserUpdateComponent } from './admin/admin-user-update/admin-user-update.component';
import { AdminWorkshopListComponent } from './admin/admin-workshop-list/admin-workshop-list.component';
import { AllWorkshopsComponent } from './all-workshops/all-workshops.component';
import { AppliedWorkshopsComponent } from './applied-workshops/applied-workshops.component';
import { BecomeOrganizerComponent } from './become-organizer/become-organizer.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { MyProfileComponent } from './my-profile/my-profile.component';
import { ConsiderApplicationsComponent } from './organizer/consider-applications/consider-applications.component';
import { OrganizerCreateWorkshopComponent } from './organizer/organizer-create-workshop/organizer-create-workshop.component';
import { OrganizerWorkshopsComponent } from './organizer/organizer-workshops/organizer-workshops.component';
import { UpdateWorkshopComponent } from './organizer/update-workshop/update-workshop.component';
import { WorkshopSingleOrganizerComponent } from './organizer/workshop-single-organizer/workshop-single-organizer.component';
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
  {path: "passch", component:PasswordChangeComponent},

  {path: "admin/login", component: AdminLoginComponent},
  {path: "admin/user-create", component: AdminUserCreateComponent},
  {path: "admin/user-update", component: AdminUserUpdateComponent},
  {path: "admin/user-listing", component: AdminUserListComponent},
  {path: "admin/workshop-listing", component: AdminWorkshopListComponent},
  {path: "admin/update-workshop", component: UpdateWorkshopComponent},
  {path: "admin/create-workshop", component: OrganizerCreateWorkshopComponent},
  
  {path: "workshop-details", component: WorkshopSingleComponent},
  {path: "my-workshops", component: AppliedWorkshopsComponent},
  {path: "organizer/my-workshops", component: OrganizerWorkshopsComponent},
  {path: "organizer/workshop-details", component: WorkshopSingleOrganizerComponent},
  {path: "organizer/create-workshop", component: OrganizerCreateWorkshopComponent},
  {path: "propose-workshop", component: BecomeOrganizerComponent},
  {path: "my-profile", component: MyProfileComponent},
  {path: "organizer/update-workshop", component: UpdateWorkshopComponent},
  {path: "organizer/consider-applications", component: ConsiderApplicationsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
