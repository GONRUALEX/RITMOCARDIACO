import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {Observable,of } from 'rxjs';
import {map, catchError} from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TranslateConfigService {
  private activateLang='es';
  constructor( private translate: TranslateService,private httpClient:HttpClient) { }

  getDefaultLanguage(){
    let final: string[];
    let language= this.translate.getBrowserLang();
    this.getPath(language).subscribe((res)=>{
      let type = res.split("/");
      final = type[2].split(".");
      this.translate.setDefaultLang(final[0]);
      this.activateLang=final[0];
      return final[0];
    });
    this.activateLang="es";
    return "es";
  }

  setLanguage( setLang ){
    this.activateLang=setLang;
    this.translate.use(setLang);
  }

 /* fileExists(file, cb) {
    fs.stat(file, (err, stats) => {
      if (err) {
        if (err.code === 'ENOENT') {
          return cb(null, false);
        } else { // en caso de otro error
          return cb(err);
        }
      }
      // devolvemos el resultado de `isFile`.
      return cb(null, stats.isFile());
    });
  }*/

  //Me dice si existe la ruta, si no existe me devuelve un la por defecto que será assets/i18n/es.json
  getPath(language: string): Observable<string> {
    const folderPath = `assets/i18n/${language.toLocaleLowerCase()}.json`;
    console.log(folderPath);
    return this.httpClient
      .get(`${folderPath}`)
      .pipe(
        map(response => {
          return folderPath;
        }),
        catchError(error => {
          return of('assets/i18n/es.json');
        })
      );
  }
  
  getLanguage(){
    return this.activateLang;
  }

}
