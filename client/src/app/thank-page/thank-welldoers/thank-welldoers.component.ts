import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { MaterialService } from 'src/app/shared/classes/material.service';
import { Thank, ThankGood } from 'src/app/shared/interfaces';
import { ThankService } from 'src/app/shared/services/thank.services';

@Component({
  selector: 'app-thank-welldoers',
  templateUrl: './thank-welldoers.component.html',
  styleUrls: ['./thank-welldoers.component.css']
})
export class ThankWelldoersComponent implements OnInit {

  thank_id: string
  thankGoods: ThankGood[] = []
  loading = false

  constructor(private thankService: ThankService) { }

  ngOnInit(): void {
    this.loading = true
    this.thankService.fetch().subscribe(thanks => {
      this.thank_id = thanks._id
      this.thankGoods = this.listToArray(thanks.list);
      this.loading = false
    });
  }

  listToArray(welldoer_good: ThankGood[]) {
    return welldoer_good.filter((value, index, self) => {return self.map(item => item.welldoer_id).indexOf(value.welldoer_id) === index})
  }
  
  addToThank(event: Event, thank_id: string, welldoer_id: string) {
    event.stopPropagation();
    this.thankService.updateByWelldoer(thank_id, welldoer_id).subscribe(
      response => {
        const idx = this.thankGoods.findIndex(p => p.welldoer_id === welldoer_id);
        this.thankGoods[idx].thanked = 1;
        MaterialService.toast('Спасибо сказано');
      },
      error => MaterialService.toast(error.error.message)
    )
    
  }
}
