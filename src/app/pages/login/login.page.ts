import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { TranslateConfigService } from '../../services/translate-config.service';
import { environment } from '../../../environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Storage } from '@ionic/storage';
const TOKEN_KEY = 'access_token';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  selectedLanguage:string;
  credentialsForm: FormGroup;
  loading:any;
 
  constructor( private helper:JwtHelperService,private storage:Storage,private formBuilder: FormBuilder, private authService: AuthService, private route:Router) { 
   
      }
 
  ngOnInit() {
    this.storage.get(TOKEN_KEY).then(token => {
      if (token) {
        let decoded = this.helper.decodeToken(token);
        let isExpired = this.helper.isTokenExpired(token);
 
        if (!isExpired) {
          this.route.navigate(['/tabs']);
        } 
        
      }
    });
    this.credentialsForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }
 
  onSubmit() {
    this.authService.presentLoading("Espere por favor");
    this.authService.login(this.credentialsForm.value).subscribe(()=>{
      this.authService.loading.dismiss();
      this.route.navigate(['/tabs']);
    },
    (err)=>{setTimeout(()=>{this.authService.loading.dismiss()},500);console.log("Error en el login",err);});
  }
 
goSignin(){
  
  this.route.navigate(['signin']);
}

goPolicy(){
  this.route.navigate(['policy']);
}

goResetPassword(){
  this.route.navigate(['reset-password']);
}


}