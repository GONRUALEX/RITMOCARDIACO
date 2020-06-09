import { Component } from '@angular/core';
import { Injectable, Inject } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { TranslateConfigService } from './services/translate-config.service';
import { AuthService } from './services/auth.service';

import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Storage } from '@ionic/storage';
import { FCM } from '@ionic-native/fcm/ngx';
import { PushNotificationService } from './services/push-notification.service';
import { Badge } from '@ionic-native/badge/ngx';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  body:any;
  constructor(
    private badge:Badge,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private translateConfigService:TranslateConfigService,
    private authService: AuthService,
    private route:Router,
    private storage:Storage,
    private helper: JwtHelperService,
    private fcm:FCM,
    private notification:PushNotificationService,
    @Inject ('LOCALSTORAGE') private localStorageRef:any
  ) {
    this.initializeApp();
  }

  initializeApp() {
 
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.translateConfigService.getDefaultLanguage();
  
   
       this.fcm.onNotification().subscribe(data=>{
        this.badge.set(30);
         /*this.body={
           "title": data.title,
           "body":data.body,
           "data":data.data
         };
         this.notification.addNotification(this.body);
        // this.notificaciones.push({"pagina":data.landing_page, parametro:data.price});
        /* console.log(data);
         if (data.wasTapped){
           console.log('Received in background');
           this.router.navigate([data.landing_page, data.price]);
   
         }else{
           console.log('received in foreground');
           this.router.navigate([data.landing_page, data.price]);
         }*/
       });
      
    });
  }
}
