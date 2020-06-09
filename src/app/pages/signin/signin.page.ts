import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { CustomValidators } from '../../validators/ValidatorPassword';
import { ValidatorsDate } from '../../validators/ValidatorsDate';
import { environment } from '../../../environments/environment';
import { Storage } from '@ionic/storage';
import { JwtHelperService } from '@auth0/angular-jwt';
const TOKEN_KEY = 'access_token';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.page.html',
  styleUrls: ['./signin.page.scss'],
})

export class SigninPage implements OnInit {
  vistaPassword: string;
  credentialsForm: FormGroup;
  iconoPassword:string;
 
  constructor(private helper:JwtHelperService,private storage:Storage,private alertCtrl:AlertController,private formBuilder: FormBuilder, private authService: AuthService, private route:Router) {
    this.credentialsForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(30),Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!$_%*?&])([A-Za-z\d$@$!$_%*?&]|[^ ,.#~()-]){8,}$')])],
      repeatPassword: ['', Validators.compose([])],                                                                                 
      birthDate:['',Validators.compose([Validators.required, ValidatorsDate.validatorsDate])],
      name: ['', Validators.compose([Validators.required,Validators.minLength(3),Validators.maxLength(30)])],
      surname: ['', Validators.compose([Validators.required,Validators.minLength(3),Validators.maxLength(30)])]
      
    });

    this.credentialsForm.get('repeatPassword').setValidators([CustomValidators.equals(this.credentialsForm.get('password')),Validators.required,Validators.minLength(3),Validators.maxLength(30)]);
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

    this.authService.checkToken();
   this.vistaPassword="password";
   this.iconoPassword="eye-off";
  }
 
  onSubmit() {
    this.register();
  }
 
  register() {  
    this.authService.presentLoading("Espere por favor");
    this.authService.register(this.credentialsForm.value).subscribe(res => {
      this.authService.loading.dismiss();
     this.alert();
      // Call Login to automatically login the new user
      //crear alerta advirtiendo de email de verificación con redireccion dandole al ok al login
         
    },
    (err)=>{setTimeout(()=>{this.authService.loading.dismiss()},500);console.log("envía un error");});
  }

  async alert(){
    const alert = await this.alertCtrl.create({
      header: 'Registro realizado con éxito',
      message: 'Se te ha enviado un correo a tu dirección de correo electrónico, una vez lo valides podrás logearte en la app',
      buttons: [ {
        text: 'Ok',
        handler: () => {
          this.route.navigate(['login']);
        }
      }]
    });
    await alert.present();
  
  }

  cambioIcono(){
    if (this.iconoPassword==='eye'){
      this.iconoPassword='eye-off';
      this.vistaPassword="password"

    }else{
      this.iconoPassword='eye';
      this.vistaPassword="text"
    }
  }
  goLogin(){
    this.route.navigate(['login']);
  }
}
