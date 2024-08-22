import { HttpClient } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { environment } from "src/app/core/environment"

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  private slider:string='slider'
  private firstImages:string='firstImages'


  constructor(private http:HttpClient) { }

getSlider(){
return this.http.get(environment.API_URL+this.slider)
}

getFirstImages(){
  return this.http.get(environment.API_URL+this.firstImages)
  }
}
