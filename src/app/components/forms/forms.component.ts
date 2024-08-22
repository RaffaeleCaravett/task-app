import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { environment, environmentErrors } from 'src/app/core/environment';
import {
  cap,
  cities,
  regions,
  userLogin,
  userSignup,
} from 'src/app/interfaces/interfaces';
import { FormsService } from 'src/app/shared/services/forms.service';
import { OfficeService } from 'src/app/shared/services/office.service';

@Component({
  selector: 'app-forms',
  templateUrl: './forms.component.html',
  styleUrls: ['./forms.component.scss'],
})
export class FormsComponent implements OnInit {

  /*
  Componente che utilizzo per chiamate http relative al signup e al login.
  */


  /*Typicized variables */
  section: string = '';
  loginForm!: FormGroup;
  signupForm!: FormGroup;
  submittedLogin: boolean = false;
  submittedSignup: boolean = false;
  cities: cities[] = [];
  region!: regions[];
  cap!: cap[];
  isLoading: boolean = false;
  background!:boolean

  /*Dependency injection */
  constructor(
    private toastr: ToastrService,
    private formsService: FormsService,
    private router: Router,
    private officeService: OfficeService,
    private translate: TranslateService
  ) {
    this.formsService.background.subscribe((data:boolean)=>{
      this.background=data
    })
  }
  /*OnInit lifecycle */
  /*Reactive Forms, Validators, Validators.pattern */
  ngOnInit(): void {
    this.section = 'login';
    this.loginForm = new FormGroup({
      email: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/),
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
    });

    this.signupForm = new FormGroup({
      nome: new FormControl('', Validators.required),
      cognome: new FormControl('', Validators.required),
      citta: new FormControl('', Validators.required),
      regione: new FormControl('', Validators.required),
      cap: new FormControl('', Validators.required),
      email: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/),
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
      sex: new FormControl('', Validators.required),
    });
    this.formsService.getCities().subscribe({
      next: (data: any) => {
        this.cities = data;
      },
      error: (error: any) => {
        this.toastr.error(error?.message || environment.COMMON_ERROR);
      },
      complete: () => {},
    });
  }
  /*Login method */
  login() {
    this.submittedLogin = true;
    if (this.loginForm.valid) {
      let userLogin: userLogin = {
        email: this.loginForm.controls['email'].value,
        password: this.loginForm.controls['password'].value,
      };
      this.formsService.login(userLogin).subscribe({
        next: (data: any) => {
          if (data && data[0]) {
            localStorage.setItem('email', data[0].email);
            localStorage.setItem('password', data[0].password);
            this.officeService.setUser(data[0]);
            this.toastr.show(this.translate.currentLang=='en'?environmentErrors.EN_SUCCESFULY_LOGGED:environmentErrors.SUCCESFULY_LOGGED);
            this.formsService.authenticateUser(true);
            setTimeout(() => {
              this.router.navigate(['/office']);
            }, 1000);
          } else {
            console.log(environmentErrors.EN_USER_NOT_EXISTS,environmentErrors.USER_NOT_EXISTS)
            this.toastr.error(
              this.translate.currentLang=='en'?
              environmentErrors.EN_USER_NOT_EXISTS
              :
              environmentErrors.USER_NOT_EXISTS
            );
          }
        },
        error: (error: any) => {
          this.toastr.error(error?.message || this.translate.currentLang=='en'?environment.EN_COMMON_ERROR:environment.COMMON_ERROR);
        },
        complete: () => {},
      });
    } else {
      this.toastr.error(this.translate.currentLang=='en'?environment.EN_COMMON_ERROR_FORMS:environment.COMMON_ERROR_FORMS);
    }
  }
  /*switch from login to signup and viceversa */
  sectionChange(value: string) {
    if (value) {
      this.isLoading = true;
      setTimeout(() => {
        this.isLoading = false;
        this.section = value;
        this.submittedLogin = false;
        this.submittedSignup = false;
      }, 2000);
    }
  }
  /*Signup method */
  register() {
    this.submittedSignup = true;
    if (this.signupForm.valid) {
      let user: userSignup = {
        nome: this.signupForm.controls['nome'].value,
        cognome: this.signupForm.controls['cognome'].value,
        citta: this.signupForm.controls['citta'].value,
        regione: this.signupForm.controls['regione'].value,
        cap: this.signupForm.controls['cap'].value,
        email: this.signupForm.controls['email'].value,
        password: this.signupForm.controls['password'].value,
        sex: this.signupForm.controls['sex'].value,
      };
      this.formsService.findUserByEmail(user.email).subscribe({
        next: (data: any) => {
          if (data && data[0]) {
            this.toastr.error(this.translate.currentLang=='en'?environmentErrors.EN_USER_ALREADY_EXISTS:environmentErrors.USER_ALREADY_EXISTS);
          } else {
            this.formsService.register(user).subscribe({
              next: (data: any) => {
                this.toastr.show(
                  this.translate.currentLang=='en'?
                  environmentErrors.EN_SUCCESFULY_SIGNED
                  :
                  environmentErrors.SUCCESFULY_SIGNED
                );
                this.isLoading = true;
                setTimeout(() => {
                  this.isLoading = false;
                  this.section = 'login';
                }, 1500);
              },
              error: (error: any) => {
                this.toastr.error(error?.message ||this.translate.currentLang=='en'?environment.EN_COMMON_ERROR : environment.COMMON_ERROR);
              },
              complete: () => {},
            });
          }
        },
        error: (error: any) => {
          this.toastr.error(error?.message || this.translate.currentLang=='en'?environment.EN_COMMON_ERROR : environment.COMMON_ERROR);
        },
        complete: () => {},
      });
    } else {
      this.toastr.error(this.translate.currentLang=='en'?environment.EN_COMMON_ERROR_FORMS : environment.COMMON_ERROR_FORMS);
    }
  }
  /*get Region And Cap by City name method */
  getRegionAndCapByCityName(cityName: string) {
    if (cityName) {
      this.formsService.getRegionByCityName(cityName).subscribe({
        next: (region: any) => {
          this.region = region;
          this.formsService.getCapByRegionName(cityName).subscribe({
            next: (cap: any) => {
              this.cap = cap;
              this.signupForm.controls['regione'].setValue(this.region[0].name);
              this.signupForm.controls['cap'].setValue(this.cap[0].cap);
              this.signupForm.updateValueAndValidity();
            },
            error: (error: any) => {
              this.toastr.error(
                error?.message ||
                this.translate.currentLang=='en'?environment.EN_COMMON_ERROR : environment.COMMON_ERROR
              );
            },
            complete: () => {},
          });
        },
        error: (error: any) => {
          this.toastr.error(
            error?.message || this.translate.currentLang=='en'?environment.EN_COMMON_ERROR : environment.COMMON_ERROR
          );
        },
        complete: () => {},
      });
    } else {
      this.toastr.error(this.translate.currentLang=='en'?environmentErrors.EN_INSERT_CITY:environmentErrors.INSERT_CITY);
    }
  }
}
