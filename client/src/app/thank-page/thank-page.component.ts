import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { ThankService } from '../shared/services/thank.services';

@Component({
  selector: 'app-thank-page',
  templateUrl: './thank-page.component.html',
  styleUrls: ['./thank-page.component.css']
})
export class ThankPageComponent implements OnInit {
  
  isRoot: boolean

  constructor(private router: Router,
    private thank: ThankService,
    private thankService: ThankService) { }

  ngOnInit(): void {
    this.isRoot = (this.router.url === '/saythanks');
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isRoot = (this.router.url === '/saythanks');
      }
    })
  }

}
