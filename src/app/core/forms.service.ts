import { Injectable } from "@angular/core"
import { BehaviorSubject } from "rxjs"
import { AuthGuard } from "./auth.guard"
import { HttpClient } from "@angular/common/http"
import { environment } from "./environment"

@Injectable({
  providedIn: 'root'
})
export class FormsService {

  public isAuthenticatedUser:BehaviorSubject<boolean> =new BehaviorSubject<boolean>(false)
  private cities:string='cities'
  constructor(private http:HttpClient,private authGuard:AuthGuard) { }

getCities(){
return this.http.get(environment.API_URL+this.cities)
}

authenticateUser(boolean:any){
  this.isAuthenticatedUser.next(boolean)
  this.authGuard.authenticateUser(boolean)
}

}
