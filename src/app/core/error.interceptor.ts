import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { catchError, delay, mergeMap, Observable, of, retryWhen } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  /*
  Interceptor che uso per intercettare gli errori di tutte le chiamate http che vengono effettuate. Lancio un toastr e mando in console l'errore
  */

  constructor(private toastr: ToastrService) {}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((e: HttpErrorResponse) => {
        this.toastr.error('Interceptor error : ' + ' ' + e.message);
        console.log('error interceptor :', e);
        return of();
      })
    );
  }
}
