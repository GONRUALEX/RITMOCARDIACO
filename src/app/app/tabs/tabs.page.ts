import { Component, OnInit, OnChanges, SimpleChanges, DoCheck, NgZone } from '@angular/core';
import { PushNotificationService } from 'src/app/services/push-notification.service';
import { ToastController } from '@ionic/angular';
import { FCM } from '@ionic-native/fcm/ngx';
import { Badge } from '@ionic-native/badge/ngx';
@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {
  notificationNumber = 0;
  constructor(private badge:Badge,private ngZone: NgZone, private fcm: FCM, private toastController: ToastController, private notificationService: PushNotificationService) {


  }

  ngOnInit() {
   
    this.notificationService.getNumberNotification().subscribe(res => {
    
      this.notificationNumber = res;
      this.badge.set(20);
    })

    this.notificationService.refreshNumberNotifications();
    this.fcm.onNotification().subscribe(data => {
     
      this.presentToast(data.title);


    });

  }



  async presentToast(mensaje) {
    const toast = await this.toastController.create({
      message:"Tienes una nueva notificación -><br/>" +mensaje,
      position: 'top',
      animated:true,
      cssClass:"my-custom-class",
      translucent:true,
      duration: 3000
      
    });
    toast.present();
  }
}
