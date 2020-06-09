import { Component, OnInit, NgZone } from '@angular/core';
import { FCM } from '@ionic-native/fcm/ngx';
import { Router } from '@angular/router';
import { PushNotificationService } from 'src/app/services/push-notification.service';
import { LoadingController } from '@ionic/angular';
import { FormGroup, FormBuilder } from '@angular/forms';
@Component({
  selector: 'app-notification',
  templateUrl: './notification.page.html',
  styleUrls: ['./notification.page.scss'],
})
export class NotificationPage implements OnInit {

  notificaciones: any;
  loading: any;
  form: FormGroup;
  constructor(private ngZone: NgZone, private fctrl: FormBuilder, private loadingCtrl: LoadingController, private notificationService: PushNotificationService, private fcm: FCM, private router: Router) {
    this.form = fctrl.group({
      title: '',
      body: '',
      data: ''
    });
  }

  ngOnInit() {
    this.refreshNotifications()

   
  }

  refresh(event) {
    this.refreshNotifications();
    event.target.complete();
  }

  deleteNotification(id) {
    this.notificationService.deleteNotification(id).subscribe(res => {
      console.log("se ha eliminado la notificación " + res);
      this.refreshNotifications();
      this.router.navigate(['/tabs/notification']);
    },
      err => {
        console.log("Error al eliminar la notification", err);
      }
    );
  }

  refreshNotifications() {
    this.presentLoading();

    this.ngZone.run(() => {
      this.notificationService.getNotifications().subscribe(res => {
        this.notificaciones = res;
        let notiaux = 0
        for (let noti in res) {

          if (res[noti].open == false) {

            notiaux++;
          }
        }
        this.notificationService.setNotificationNumber(notiaux);
        this.loadingCtrl.dismiss();
      }, err => {console.log(err);
        setTimeout(()=>{this.loadingCtrl.dismiss();},500 );   
      });
    });

  }


  async presentLoading() {
    this.loading = await this.loadingCtrl.create({
      message: 'loading'

    });
    return this.loading.present();
  }

  goNotification(notification) {
    this.notificationService.openNotifications(notification._id).subscribe(res => {
      this.refreshNotifications();
    },
      err => {
        console.log(err);
      }

    );

    this.router.navigate(['notification-detail', notification.title, notification.body, notification.data, notification._id]);
  }

  onSubmit() {

    this.notificationService.addNotification(this.form.value).subscribe(res => {
      this.notificationService.getNotifications().subscribe(res => {
        this.refreshNotifications();
        setTimeout(() => { this.notificationService.sendNotification(this.form.value); }, 1000);
      }, err => { console.log(err) });
      console.log(res)
    },
      err => {
        console.log("Error en el envío de la notificación", err);
      });




  }

}
