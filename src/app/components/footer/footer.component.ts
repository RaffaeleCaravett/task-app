import { Component, OnInit } from '@angular/core';
import { FormsService } from 'src/app/shared/services/forms.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  images: any[] = [];
  background!:boolean
constructor(
  private formsService:FormsService
)
{
  this.formsService.background.subscribe((data: boolean) => {
    this.background = data;
  });
}

  ngOnInit(): void {
    this.images = [
      {
        title: 'Facebook',
        link: 'https://www.facebook.com/',
        image: '../../../assets/footer/fb.png',
      },
      {
        title: 'Instagram',
        link: 'https://www.instagram.com',
        image: '../../../assets/footer/ig.png',
      },
      {
        title: 'Linkedin',
        link: 'https://www.linkedin.com',
        image: '../../../assets/footer/lk.png',
      },
    ];
  }
}
