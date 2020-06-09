import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRoute, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { isNullOrUndefined } from 'util';
import { map } from "rxjs/operators";
@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate{

  constructor(public auth:AuthService, private route:Router) { 
    
  }

  canActivate(
    route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean{

      this.auth.checkToken();
      return this.auth.isAuthenticated().then(
        
          auth=>
          { console.log("esto es lo qu da en el service",auth.value);
            if(isNullOrUndefined(auth.value) || !auth.value )
            {
              this.route.navigate(["/login"]);
              return false;
            }else{
              return true;
            }
          }
        )
      ;
    
  }
}
