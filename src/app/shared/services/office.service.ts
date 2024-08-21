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
  private elements:string='elements'
  private user:any={}
  constructor(private http:HttpClient) { }

getStatus(){
return this.http.get(environment.API_URL+this.status)
}

getTasksByStatus(status:string,userId:string,page:number,end:number,size:number,sort:string,order:string){
  if(order=='asc'){
return this.http.get(environment.API_URL+this.tasks+`?status=${status}&user=${userId}&_start=${page}&_end=${end}&_limit=${size}&_sort=${sort}&_order=asc`)
  }else {
    return this.http.get(environment.API_URL+this.tasks+`?status=${status}&user=${userId}&_start=${page}&_end=${end}&_limit=${size}&_sort=-${sort}`)
  }
}
getTasks(){
  return this.http.get(environment.API_URL+this.tasks)
  }
  getTasksByTitle(title:string){
    return this.http.get(environment.API_URL+this.tasks+`?title=${title}`)
    }
postTask(task:any){
  return this.http.post(environment.API_URL+this.tasks,task)
  }
  putTask(task:any,id:string){
    return this.http.put(environment.API_URL+this.tasks+`/${id}`,task)
    }
    deleteTask(id:string){
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
    getElements(){
      return this.http.get(environment.API_URL+this.elements)
    }
    patchTask(object:any,id:string){
      return this.http.patch(environment.API_URL+this.tasks+`/${id}`,object)
    }
}
