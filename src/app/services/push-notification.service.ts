import { Injectable } from '@angular/core';
import { LoadingController, AlertController, Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { FCM } from '@ionic-native/fcm/ngx';
import { BehaviorSubject, Observer } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class PushNotificationService {
  body:any;
  url = environment.url;
  numberNotification=new BehaviorSubject(0);
  constructor(private fcm: FCM,private route:Router, private loadingCtrl:LoadingController, private http: HttpClient,
    private plt: Platform, private alertController: AlertController,private storage:Storage) { 
      this.refreshNumberNotifications();
    }


  addNotification(body){

    return this.http.post(`${this.url}/api/notification/add`,body);
  }
  refreshNumberNotifications(){
    this.getNotifications().subscribe(res=>{
      let notiaux=0
      for (let noti in res){
       
        if (res[noti].open==false){
         
          notiaux++;
        }
      }
      this.numberNotification.next(notiaux);
    });
  }
  getNotifications(){
   return this.http.get(`${this.url}/api/notifications`);
   
  }
  setNotificationNumber(notiaux){
  
    this.numberNotification.next(notiaux);
   
  }
  getNumberNotification(){
    return this.numberNotification;
  }
  openNotifications(body){
    return this.http.get(`${this.url}/api/notification/open/${body}`);
  }

  deleteNotification(id):any{
    return this.http.get(`${this.url}/api/notification/rm/${id}`);
  }

  sendNotification(data){
    
    this.fcm.getToken().then(token => {
      console.log("notification -> ",token);
    
  
    this.body={
      "notification":{
        "title":"Ionic 4 Notification",
        "body":"This notification sent from POSTMAN using Firebase HTTP protocol",
        "sound":"sound",
        "click_action":"FCM_PLUGIN_ACTIVITY",
        "icon":"fcm_push_icon"
      },
      "data":{
        "body":data.body,
        "title":data.title,
        "data":data.data
      },
        "to":token,
        "priority":"high",
        "restricted_package_name":""
    };
    console.log("el token del storage",this.body);
    let headerss = new HttpHeaders().set('Authorization',"key=AAAAhZKEq-Q:APA91bHodaiMjyBdXEepjJ33J8pnx_48kwXhYUd0jp30Y9_Y5CPVtyEa-tuKeSCSFjaaX7IiA_cf0kYcDYnBTz0GKFDhq6QJXZVZZ5BsU0oG93WjK_Rbwv2aPNNfTQ_5hVWfunidK0jf");
    this.http.post('https://fcm.googleapis.com/fcm/send',this.body,{headers:headerss}).subscribe(res=>{

      console.log("enviado", res);return true;});
  }).catch(err=>{
    console.log("enviado", err);
    return false;
  });
   }

}
