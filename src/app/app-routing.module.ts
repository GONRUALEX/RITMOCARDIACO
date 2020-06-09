import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from './services/auth-guard.service';
import { AuthNotGuardService } from './services/auth-not-guard.service';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full', canActivate:[AuthNotGuardService] },
 {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule),
    canActivate:[AuthNotGuardService]
  },
  {
    path: 'signin',
    loadChildren: () => import('./pages/signin/signin.module').then( m => m.SigninPageModule),
    canActivate:[AuthNotGuardService]
  },
  {
    path: 'home',
    loadChildren: () => import('./app/home/home.module').then( m => m.HomePageModule),
    canActivate:[AuthGuardService]
  },
  {
    path: 'more',
    loadChildren: () => import('./app/more/more.module').then( m => m.MorePageModule),
    canActivate:[AuthGuardService]
  },
  {
    path: 'language',
    loadChildren: () => import('./app/language/language.module').then( m => m.LanguagePageModule),
    canActivate:[AuthGuardService]
  },
  {
    path: 'policy',
    loadChildren: () => import('./pages/policy/policy.module').then( m => m.PolicyPageModule),
    
  },
  {
    path: 'reset-password',
    loadChildren: () => import('./pages/reset-password/reset-password.module').then( m => m.ResetPasswordPageModule),
    canActivate:[AuthNotGuardService]
  },
  {
    path: 'tabs',
    loadChildren: () => import('./app/tabs/tabs.module').then( m => m.TabsPageModule),
    canActivate:[AuthGuardService]
  },
  {
    path: 'notification-detail/:title/:body/:data/:id',
    loadChildren: () => import('./app/notification-detail/notification-detail.module').then( m => m.NotificationDetailPageModule),
    canActivate:[AuthGuardService]
  },
  {
    path: '**',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule),
    canActivate:[AuthNotGuardService]
  }

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
