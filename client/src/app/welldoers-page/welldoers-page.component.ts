import { Component, OnInit } from '@angular/core';
import { WelldoersService } from '../shared/services/welldoers.service';
import { Welldoer } from '../shared/interfaces';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-welldoers-page',
  templateUrl: './welldoers-page.component.html',
  styleUrls: ['./welldoers-page.component.css']
})
export class WelldoersPageComponent implements OnInit {

  welldoers$: Observable<Welldoer[]>

  constructor(private welldoersService: WelldoersService) { }

  ngOnInit(): void {
    this.welldoers$ = this.welldoersService.fetch()
  }

}
