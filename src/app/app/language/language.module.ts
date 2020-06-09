import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LanguagePageRoutingModule } from './language-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { LanguagePage } from './language.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LanguagePageRoutingModule,
    TranslateModule.forChild(),
    ComponentsModule
  ],
  declarations: [LanguagePage]
})
export class LanguagePageModule {}
