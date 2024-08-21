import { HttpClient } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { environment } from "src/app/core/environment"

@Injectable({
  providedIn: 'root'
})
export class OfficeService {

  private status:string='status'
  private tasks:string='tasks'
  private user:any={}
  constructor(private http:HttpClient) { }

getStatus(){
return this.http.get(environment.API_URL+this.status)
}

getTasksByStatus(status:string){
return this.http.get(environment.API_URL+this.tasks+`?status=${status}`)
}
getTasks(){
  return this.http.get(environment.API_URL+this.tasks)
  }
postTask(task:any){
  return this.http.post(environment.API_URL+this.tasks,task)
  }
  putTask(task:any,id:number){
    return this.http.put(environment.API_URL+this.tasks+`/${id}`,task)
    }
    deleteTask(id:number){
      return this.http.delete(environment.API_URL+this.tasks+`/${id}`)
      }
    setUser(user:any){
      this.user=user
    }
    getUser(){
      return this.user
    }
}
