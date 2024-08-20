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
  private regions:string='regions'
  private cap:string='cap'

  constructor(private http:HttpClient,private authGuard:AuthGuard) { }

getCities(){
return this.http.get(environment.API_URL+this.cities)
}

getRegionByCityName(cityName:string){
  return this.http.get(environment.API_URL+this.regions+`?citta=${cityName}`)
}

getCapByRegionName(cityName:string){
  return this.http.get(environment.API_URL+this.cap+`?citta=${cityName}`)
}

authenticateUser(boolean:any){
  this.isAuthenticatedUser.next(boolean)
  this.authGuard.authenticateUser(boolean)
}

}
