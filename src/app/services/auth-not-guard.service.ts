import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRoute, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { isNullOrUndefined } from 'util';
import { map } from "rxjs/operators";
@Injectable({
  providedIn: 'root'
})
export class AuthNotGuardService implements CanActivate{

  constructor(public auth:AuthService,private route:Router) { 
    this.auth.checkToken();
  }


  canActivate(
    route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean{
      this.auth.checkToken();
      return this.auth.isAuthenticated().then(
        
        
          auth=>
          {
            if(isNullOrUndefined(auth.value) || !auth.value )
            {console.log("esto sssses lo qu da",auth.value);
              
              return true;
            }else{
              console.log("esto es losss qu da",auth.value);
              this.route.navigate(["/tabs"]);
              return false;
            }
          }
        )
      ;

        }


}