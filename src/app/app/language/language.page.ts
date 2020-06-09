import { Component, OnInit } from '@angular/core';
import { TranslateConfigService } from '../../services/translate-config.service';
import {Observable,of } from 'rxjs';
import {map, catchError} from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-language',
  templateUrl: './language.page.html',
  styleUrls: ['./language.page.scss'],
})
export class LanguagePage implements OnInit {
  activateLang:string;
  constructor(private translateConfig:TranslateConfigService,private httpClient:HttpClient) { }

  ngOnInit() {
    this.activateLang=this.translateConfig.getLanguage();
  }

  changeLanguage(){
    this.getPath(this.activateLang).subscribe((res)=>{
      let languageArray=res.split("/");
      let languageFinal=languageArray[2].split(".");
      this.translateConfig.setLanguage(languageFinal[0]);
    },
    (err)=>{
      this.translateConfig.setLanguage(this.translateConfig.getDefaultLanguage());
    }
    );
 
  }

  getPath(language: string): Observable<string> {
    const folderPath = `assets/i18n/${language.toLocaleLowerCase()}.json`;
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

}
