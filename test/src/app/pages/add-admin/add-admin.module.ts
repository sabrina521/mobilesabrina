import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { AddAdminPage } from './add-admin.page';
import { ReactiveFormsModule } from "@angular/forms";
import { AddAdminPageRoutingModule } from './add-admin-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    AddAdminPageRoutingModule

  ],
  declarations: [AddAdminPage]
})
export class AddAdminPageModule {}


