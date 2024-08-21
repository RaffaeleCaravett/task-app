import { HttpClient } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { environment } from "src/app/core/environment"

@Injectable({
  providedIn: 'root'
})
export class OfficeService {

  private status:string='status'
  private tasks:string='tasks'
  private directions:string='directions'
  private tasksAttributes:string='tasksAttributes'
  private user:any={}
  constructor(private http:HttpClient) { }

getStatus(){
return this.http.get(environment.API_URL+this.status)
}

getTasksByStatus(status:string,page:number,size:number,sort:string,order:string){
  if(order=='asc'){
return this.http.get(environment.API_URL+this.tasks+`?status=${status}&_page=${page}&_limit=${size}&_sort=${sort}&_order=asc`)
  }else {
    return this.http.get(environment.API_URL+this.tasks+`?status=${status}&_page=${page}&_limit=${size}&_sort=-${sort}`)
  }
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
    getAttributes(){
      return this.http.get(environment.API_URL+this.tasksAttributes)
    }
    getDirections(){
      return this.http.get(environment.API_URL+this.directions)
    }
}
