import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RitmoCardiacoPageRoutingModule } from './ritmo-cardiaco-routing.module';

import { RitmoCardiacoPage } from './ritmo-cardiaco.page';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { ModalPage } from '../modal/modal.page';
import { ModalPageModule } from '../modal/modal.module';

@NgModule({
entryComponents :[
    ModalPage
],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    RitmoCardiacoPageRoutingModule,
    ComponentsModule,
    ModalPageModule
  ],
  declarations: [RitmoCardiacoPage]
})
export class RitmoCardiacoPageModule {}
