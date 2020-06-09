import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


import { TabsPage } from './tabs.page';
import { AuthGuardService } from 'src/app/services/auth-guard.service';

const routes: Routes = [
  {
    path:'',
    redirectTo:'home',
    pathMatch: 'full'
  },
  {
    path: '',
    component: TabsPage,
    children:[
      {
        path: 'home',
        loadChildren: () => import('../home/home.module').then( m => m.HomePageModule),
        canActivate:[AuthGuardService]

      },
      {
        path: 'ritmo-cardiaco',
        loadChildren: () => import('../ritmo-cardiaco/ritmo-cardiaco.module').then( m => m.RitmoCardiacoPageModule),
        canActivate:[AuthGuardService]

      },
      {
        path: 'notification',
        loadChildren: () => import('../notification/notification.module').then( m => m.NotificationPageModule),
        canActivate:[AuthGuardService]

      },
      {
        path: 'more',
        loadChildren: () => import('../more/more.module').then( m => m.MorePageModule),
        canActivate:[AuthGuardService]

      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
