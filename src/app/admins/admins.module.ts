import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminsRoutingModule } from './admins-routing.module';
import { AdminComponent } from './admin.component';
import { AdminAddComponent } from './admin-add/admin-add.component';
import { AdminEditComponent } from './admin-edit/admin-edit.component';
import { AdminDeleteComponent } from './admin-delete/admin-delete.component';
import { AdminListComponent } from './admin-list/admin-list.component';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/nav/shared/shared.module';


@NgModule({
  declarations: [
    AdminComponent,
    AdminAddComponent,
    AdminEditComponent,
    AdminDeleteComponent,
    AdminListComponent
  ],
  imports: [
    CommonModule,
    AdminsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class AdminsModule { }
