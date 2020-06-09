import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-more',
  templateUrl: './more.page.html',
  styleUrls: ['./more.page.scss'],
})
export class MorePage implements OnInit {
  constructor(private route:Router ,private authService:AuthService, private toastController:ToastController) { }

  ngOnInit() {
  }
  logout() {
    this.authService.logout();
    let toast = this.toastController.create({
      message: 'logout con éxito',
      duration: 3000
    });
    toast.then(toast => toast.present());
  }

llamarespecial(){
  this.authService.probarEspecial();
}
  goLanguage(){
    this.route.navigate(['language']);
  }
}
