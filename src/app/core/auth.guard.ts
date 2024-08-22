import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
/*
  Guardia del router dell'applicativo. Contiene una variabile e un metodo per facilitare la gestione del ritorno del valore di approvazione della guardia.
 */

  constructor() {}

  isAuthenticated: boolean = false;

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.isAuthenticated;
  }
  authenticateUser(bool?: boolean) {
    if (bool) {
      this.isAuthenticated = bool;
    } else {
      this.isAuthenticated = false;
    }
  }
}
