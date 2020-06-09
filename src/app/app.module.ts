import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
//badge
import { Badge } from '@ionic-native/badge/ngx';
//autentificación
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Storage, IonicStorageModule } from '@ionic/storage';
import { JwtModule, JWT_OPTIONS } from '@auth0/angular-jwt';
import { environment } from '../environments/environment';

//traducciones
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateConfigService } from '../app/services/translate-config.service';
import {NgxWebstorageModule} from 'ngx-webstorage';
//componentes creados
import { ComponentsModule } from './components/components.module';
import { BLE } from '@ionic-native/ble/ngx';
import { LOCALSTORAGE_PROVIDER } from './Util/browser-api';

//Firebase notificaciones
import { FCM } from '@ionic-native/fcm/ngx';

//traducción
export function LanguageLoader(http:HttpClient){
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

//encriptacion
import { AES256 } from '@ionic-native/aes-256/ngx';


//autentificacion
export function jwtOptionsFactory(storage) {
  return {
    tokenGetter: () => {
      return storage.get('access_token');
    },
    whitelistedDomains: ["servidor-proyecto.herokuapp.com"]
  }
}



@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule,
    HttpClientModule,
    ComponentsModule,
    NgxWebstorageModule.forRoot(),
    TranslateModule.forRoot({
      loader:{
        provide: TranslateLoader,
        useFactory: (LanguageLoader),
        deps: [HttpClient]
      }
    }),
    IonicStorageModule.forRoot(),
    JwtModule.forRoot({
      jwtOptionsProvider: {
        provide: JWT_OPTIONS,
        useFactory: jwtOptionsFactory,
        deps: [Storage],
      }
    })],
  providers: [
    LOCALSTORAGE_PROVIDER,
    AES256,
    FCM,
    BLE,
    StatusBar,
    Badge,
    SplashScreen,
    TranslateConfigService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
