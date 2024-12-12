import { Routes } from '@angular/router';
import { LoginComponent } from '../users/views/login/login.component';
import { AdminPanelComponent } from '../users/views/admin-panel/admin-panel.component';
import { CreateUserComponent } from '../users/views/create-user/create-user.component';
import { EditUserComponent } from '../users/views/edit-user/edit-user.component';
import { UserAccountComponent } from '../users/views/user-account/user-account.component';
import { ChangePasswordComponent } from '../users/views/change-password/change-password.component';
import { ShopManagementComponent } from '../users/views/shop-management/shop-management.component';
import { OrderListComponent } from './orders/views/order-list/order-list.component';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    // { path: 'reset-password', component: ResetPasswordComponent },
    { path: 'shops', component: ShopManagementComponent },
    { path: 'admin', component: AdminPanelComponent },
    { path: 'create-user', component: CreateUserComponent },
    { path: 'edit-user/:id', component: EditUserComponent },
    { path: 'my-account', component: UserAccountComponent },
    { path: 'change-password', component: ChangePasswordComponent },
    {path:'orders', component: OrderListComponent}
  ];
  