import { Component, OnInit, Input, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { GoodsService } from 'src/app/shared/services/goods.services';
import { Good } from 'src/app/shared/interfaces';
import { MaterialService, MaterialInstance } from 'src/app/shared/classes/material.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-goods-form',
  templateUrl: './goods-form.component.html',
  styleUrls: ['./goods-form.component.css']
})
export class GoodsFormComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input('welldoerId') welldoerId: string
  @ViewChild('modal') modalRef: ElementRef 

  goods: Good[] = []
  loading = false
  modal: MaterialInstance
  goodId = null
  form: FormGroup

  constructor(private goodsService: GoodsService) { }

  ngOnDestroy(): void {
    this.modal.destroy()
  }
  ngAfterViewInit(): void {
    this.modal = MaterialService.initModal(this.modalRef)
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      description: new FormControl(null, Validators.required),
      lifetimeDays: new FormControl(1, [Validators.required, Validators.min(1)])
    })

    this.loading = true
    this.goodsService.fetch(this.welldoerId).subscribe(goods => {
      this.goods = goods;
      this.loading = false
    })
  }

  onSelectGood(good: Good) {
    this.goodId = good._id
    this.form.patchValue({
      description: good.description,
      lifetimeDays: good.lifetimeDays
    });
    this.modal.open();
    MaterialService.updateTextInputs();
  }

  onAddGood() {
    this.goodId = null;
    this.form.reset({description: null, lifetimeDays: 3});
    this.modal.open();
    MaterialService.updateTextInputs();
  }

  onDeleteGood(event: Event, good: Good) {
    event.stopPropagation()
    const decision = window.confirm(`Удалить доброе дело "${good.description}"?`)

    if (decision) {
      this.goodsService.delete(good).subscribe(
        response => {
          const idx = this.goods.findIndex(p => p._id === good._id)
          this.goods.splice(idx, 1)
          MaterialService.toast(response.message)
        },
        error => MaterialService.toast(error.error.message)
      )
    }
  }

  onCancel() {
    this.modal.close();
  }

  onSubmit() {
    this.form.disable()

    const newGood: Good = {
      description: this.form.value.description,
      lifetimeDays: this.form.value.lifetimeDays,
      welldoer: this.welldoerId
    }

    const completed = () => {
      this.modal.close()
      this.form.reset({description: '', lifetimeDays: 3})
      this.form.enable()
    }

    if (this.goodId) {
      newGood._id = this.goodId
      this.goodsService.update(newGood).subscribe(
        good => {
          const idx = this.goods.findIndex(p => p._id === good._id)
          this.goods[idx] = good
          MaterialService.toast('Изменения сохранены')
        },
        error => MaterialService.toast(error.error.message),
        completed
      )
    } else {
      this.goodsService.create(newGood).subscribe(
        good => {
          MaterialService.toast('Доброе дело добавлено')
          this.goods.push(good)
        },
        error => MaterialService.toast(error.error.message),
        completed
      )
    }


  }

}
