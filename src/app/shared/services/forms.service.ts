import { Injectable } from "@angular/core"
import { BehaviorSubject } from "rxjs"
import { HttpClient } from "@angular/common/http"
import { AuthGuard } from "src/app/core/auth.guard"
import { environment } from "src/app/core/environment"

@Injectable({
  providedIn: 'root'
})
export class FormsService {

  public isAuthenticatedUser:BehaviorSubject<boolean> =new BehaviorSubject<boolean>(false)
  private cities:string='cities'
  private regions:string='regions'
  private cap:string='cap'
  private users:string='users'

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
register(user:any){
return this.http.post(environment.API_URL+this.users,user)
}
login(userLogin:any){
return this.http.get(environment.API_URL+this.users+`?email=${userLogin.email}&password=${userLogin.password}`)
}
findUserByEmail(email:string){
  return this.http.get(environment.API_URL+this.users+`?email=${email}`)
}
}
