import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { PushNotificationService } from 'src/app/services/push-notification.service';


@Component({
  selector: 'app-notification-detail',
  templateUrl: './notification-detail.page.html',
  styleUrls: ['./notification-detail.page.scss'],
})
export class NotificationDetailPage implements OnInit {
title:any;
body:any;
data:any;
id:any;
  constructor(private pushService:PushNotificationService, private route:ActivatedRoute) { 
   // this.notification = this.route.snapshot.params['notification'];
 // console.log("dfsdfsdfdsfdsfsdfsdfsdfdsf",this.notification);
   this.route.params.subscribe(params => {
   
    this.title=params['title'];
    this.body=params['body'];
    this.data=params['data'];
    this.id=params['id'];
  });
   
  }

  ngOnInit() {
    
  }

}
