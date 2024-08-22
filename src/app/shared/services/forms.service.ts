import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AuthGuard } from 'src/app/core/auth.guard';
import { environment } from 'src/app/core/environment';
import { userLogin, userSignup } from 'src/app/interfaces/interfaces';

@Injectable({
  providedIn: 'root',
})
export class FormsService {

  /*
  In questo service riferito al forms component gestisco tutte le chiamate http e la logica della chiamate, uso anche delle behaviorSubject per spedire informazioni disponibili
  all'interno dell'applicazione quandunque ci siano dei cambiamenti di valore. Utilizzo i moduli httpClient che mi aiutano a ritornare un observable da gestire ,poi, nel
  componente ts di riferimento. Utilizzo delle @PathVariable dell'url di richiesta e per l'api_url di base ho utilizzato un environmet generale.
  Inoltre creo un metodo per gestire direttamente il ritorno della guardia delle rotte AuthGuard.
  */

  public isAuthenticatedUser: BehaviorSubject<boolean> =
  new BehaviorSubject<boolean>(false);
  private cities: string = 'cities';
  private regions: string = 'regions';
  private cap: string = 'cap';
  private users: string = 'users';
  private backgroundMode:boolean =false
  public background: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  constructor(private http: HttpClient, private authGuard: AuthGuard) {}

  getCities() {
    return this.http.get(environment.API_URL + this.cities);
  }

  getRegionByCityName(cityName: string) {
    return this.http.get(
      environment.API_URL + this.regions + `?citta=${cityName}`
    );
  }

  getCapByRegionName(cityName: string) {
    return this.http.get(environment.API_URL + this.cap + `?citta=${cityName}`);
  }

  authenticateUser(boolean: boolean) {
    this.isAuthenticatedUser.next(boolean);
    this.authGuard.authenticateUser(boolean);
  }
  register(user: userSignup) {
    return this.http.post(environment.API_URL + this.users, user);
  }
  login(userLogin: userLogin) {
    return this.http.get(
      environment.API_URL +
        this.users +
        `?email=${userLogin.email}&password=${userLogin.password}`
    );
  }
  findUserByEmail(email: string) {
    return this.http.get(environment.API_URL + this.users + `?email=${email}`);
  }
  setBackground(){
    this.backgroundMode=!this.backgroundMode
this.background.next(this.backgroundMode)
}
}
