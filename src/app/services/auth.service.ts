import { Platform, AlertController, LoadingController } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Storage } from '@ionic/storage';
import { environment } from '../../environments/environment';
import { tap, catchError } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { ok } from 'assert';
import { Router } from '@angular/router';
import { stringify } from 'querystring';
var authenticationState = new BehaviorSubject(null);
const TOKEN_KEY = 'access_token';
 
@Injectable({
  providedIn: 'root'
})
export class AuthService  {
  loading:any;
  url = environment.url;
  user = null;
  authenticationState = new BehaviorSubject(this. checkTokenInitialize());
 
  constructor(private route:Router, private loadingCtrl:LoadingController, private http: HttpClient, private helper: JwtHelperService, private storage: Storage,
    private plt: Platform, private alertController: AlertController) {
    this.plt.ready().then(() => {
      this.checkToken();
    });
  }
  
  ngOnInit(){

  }

  changeState(valor){
    this.authenticationState.next(valor);
  }
  checkTokenInitialize():any{
    this.storage.get(TOKEN_KEY).then(token => {
      if (token) {
        let decoded = this.helper.decodeToken(token);
        let isExpired = this.helper.isTokenExpired(token);
 
        if (isExpired) {
          this.storage.remove(TOKEN_KEY);
         return false;
        } else {
          this.user = decoded;
          return true;
        }
        
      }else{
        return false;
      }
    });
  }
  async checkToken() {
    await this.storage.get(TOKEN_KEY).then(token => {
      if (token) {
        let decoded = this.helper.decodeToken(token);
        let isExpired = this.helper.isTokenExpired(token);
 
        if (isExpired) {
          this.storage.remove(TOKEN_KEY);
          this.authenticationState.next(false);
        } else {
          this.user = decoded;
          this.authenticationState.next(true);
        }
      }else{
        this.authenticationState.next(false);
      }
    });
  }
 
  register(credentials) {
    return this.http.post(`${this.url}/api/register`, credentials).pipe(
      catchError(e => {
        this.showAlert(e.error.msg);
        throw new Error(e);
      })
    );
  }
  probarEspecial(){
    console.log("entra");

    let headerss:string;
    this.storage.get(TOKEN_KEY).then(token => { headerss=token});
    
    
    return this.http.get(`${this.url}/api/special`).
    subscribe(res=>{console.log(res['msg'])}, err=>{console.log("slkdjflskd",err['msg'])});
  }
  login(credentials) {
 
    console.log(`${this.url}/api/login`);
    return this.http.post(`${this.url}/api/login`, credentials)
      .pipe(
        tap(res => {
          console.log(res['token']);
          this.storage.set(TOKEN_KEY, res['token']);
          this.user = this.helper.decodeToken(res['token']);
          this.authenticationState.next(true);
        }),
        catchError(e => {
          this.loading.dismiss();
          this.showAlert(e.error.msg);
          throw new Error(e);
        })
      );
  }
 
  logout() {
    this.storage.remove(TOKEN_KEY).then(() => {
      this.authenticationState.next(false);
      this.storage.remove(TOKEN_KEY);
      this.route.navigate(['/login']);
    return true;
    }).catch(err=>{return false;});
  }
 
  resetPassword(credentials){
    return this.http.post(`${this.url}/api/reset`, credentials).pipe(
      tap(
        res=>{
          console.log(res);
          this.showAlert(" An email has been sent to reset your password to your email address","Warning");
          return "ok";
        }
      ), 
      catchError(e => {
        this.showAlert(e.error.msg);
        throw new Error(e);
      })
    );

  }
  getSpecialData() {
    return this.http.get(`${this.url}/api/special`).pipe(
      catchError(e => {
        let status = e.status;
        if (status === 401) {
          this.showAlert('You are not authorized for this!');
          this.logout();
        }
        throw new Error(e);
      })
    )
  }
 
  async isAuthenticated() {

    return await this.authenticationState;
  }
 
  showAlert(msg, header='Error') {
    let alert = this.alertController.create({
      message: msg,
      header: header,
      buttons: ['OK']
    });
    alert.then(alert => alert.present());
  }

async presentLoading(message:string){
  this.loading= await this.loadingCtrl.create({
    message
  });
  return this.loading.present();
}
async dismissLoading(){
  return this.loading.dismiss();
}

mybandBD(id, secretKey){
  let myband={
    "deviceMyBand":id,
    "secretKey":secretKey
  }
  return this.http.post(`${this.url}/api/myband`, myband)
  .pipe(
    tap(res => {
      console.log("datos de la my band en bd",res)
    }),
    catchError(e => {
      console.log("Error al añadir los datos de la my band",e);
      throw new Error(e);
    })
  );

}

getMyBand(){
  return this.http.get(`${this.url}/api/myband`);
}

}