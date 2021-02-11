import {AfterViewInit, Component, ElementRef, Input, OnDestroy, ViewChild} from '@angular/core'
import {Thank} from '../../shared/interfaces'
import {MaterialInstance, MaterialService} from '../../shared/classes/material.service'

@Component({
  selector: 'app-history-list',
  templateUrl: './history-list.component.html',
  styleUrls: ['./history-list.component.css']
})
export class HistoryListComponent implements OnDestroy, AfterViewInit {
  @Input() thanks: Thank[]
  @ViewChild('modal') modalRef: ElementRef

  selectedThank: Thank
  modal: MaterialInstance

  ngOnDestroy() {
    this.modal.destroy()
  }

  ngAfterViewInit() {
    this.modal = MaterialService.initModal(this.modalRef)
  }
  
  computeTotal(thank: Thank): number {
    let thanked = thank.list.reduce((total, item) => {
      return total += item.thanked
    }, 0)
    let total = thank.list.reduce((total, item) => {
      return total += 1
    }, 0)
    return thanked / total * 100
  }

  selectThank(thank: Thank) {
    this.selectedThank = thank
    this.modal.open()
  }

  closeModal() {
    this.modal.close()
  }

}
