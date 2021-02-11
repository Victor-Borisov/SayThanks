import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { MaterialService } from 'src/app/shared/classes/material.service';
import { GoodsService } from 'src/app/shared/services/goods.services';
import { ThankService } from 'src/app/shared/services/thank.services';
import { Thank, ThankGood } from 'src/app/shared/interfaces';
import { Observable } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';

@Component({
  selector: 'app-thank-goods',
  templateUrl: './thank-goods.component.html',
  styleUrls: ['./thank-goods.component.css']
})
export class ThankGoodsComponent implements OnInit {

  thank$: Observable<Thank>;
  weldoerId: string;
  
  constructor(private route: ActivatedRoute,
    private goodsService: GoodsService,
    private thankService: ThankService) { }

  ngOnInit(): void {
      this.thank$ = this.route.params.pipe(
      switchMap(
        (params: Params) => {
          this.weldoerId = params['id'];
          return this.thankService.fetch()
        }
      )
    )
  }

  listToArray(welldoer_good: ThankGood[], welldoerId: string = this.weldoerId) {
    return welldoer_good.filter((value, index, self) => {return value.welldoer_id === welldoerId})
  }

  addToThank(thank_id: string, good_id: string) {
    this.thank$ = this.thankService.updateByGood(thank_id, good_id);
    MaterialService.toast('Спасибо сказано');
  }
}
