import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RitmoCardiacoPage } from './ritmo-cardiaco.page';

const routes: Routes = [
  {
    path: '',
    component: RitmoCardiacoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RitmoCardiacoPageRoutingModule {}
