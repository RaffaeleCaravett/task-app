import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/app/core/environment';
import { firstImages, slider } from 'src/app/interfaces/interfaces';
import { FormsService } from 'src/app/shared/services/forms.service';
import { HomeService } from 'src/app/shared/services/home.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {

  /*
  In questo componente effettuo delle chiamate http e le sottoscrivo gestendo gli stati delle stesse.
  */
  /*typicized variables*/
  firstImages: firstImages[] = [];
  slider: slider[] = [];
  background!:boolean
  loremIpsumDesc:string=''
  loremIpsumTitle:string=''
  /*dependency injection*/
  constructor(
    private homeService: HomeService,
    private toastr: ToastrService,
    private formsService:FormsService
  ) {
    this.formsService.background.subscribe((data: boolean) => {
      this.background = data;
    });
  }
  /*On Init lifecicle*/
  ngOnInit(): void {
    this.loremIpsumDesc=environment.LOREM_IPSUM_DESC
    this.loremIpsumTitle=environment.LOREM_IPSUM_TITLE
    localStorage.setItem('location', '/');
    this.getElements();
  }
  /*get things to display in html method*/
  getElements() {
    this.homeService.getFirstImages().subscribe({
      next: (data: any) => {
        if (data && data[0]) {
          this.firstImages = data;
        } else {
          this.toastr.error(environment.COMMON_ERROR);
        }
      },
      error: (error) => {
        this.toastr.error(error.message || environment.COMMON_ERROR);
      },
      complete: () => {},
    });
    this.homeService.getSlider().subscribe({
      next: (data: any) => {
        if (data && data[0]) {
          this.slider = data;
        } else {
          this.toastr.error(environment.COMMON_ERROR);
        }
      },
      error: (error) => {
        this.toastr.error(error.message || environment.COMMON_ERROR);
      },
      complete: () => {},
    });
  }
}
