import {AfterViewInit, Component, ElementRef, OnDestroy, ViewChild} from '@angular/core'
import {AnalyticsService} from '../shared/services/analytics.service'
import {AnalyticsPage} from '../shared/interfaces'
import {Chart} from 'chart.js'
import {Subscription} from 'rxjs'

@Component({
  selector: 'app-analytics-page',
  templateUrl: './analytics-page.component.html',
  styleUrls: ['./analytics-page.component.css']
})
export class AnalyticsPageComponent implements AfterViewInit, OnDestroy {

  @ViewChild('ratio') ratioRef: ElementRef
  @ViewChild('thanks') thanksRef: ElementRef

  aSub: Subscription
  average: number
  pending = true

  constructor(private service: AnalyticsService) {
  }

  ngAfterViewInit() {
    const ratioConfig: any = {
      label: 'Выполненность задачи по сказанным спасибо',
      color: 'rgb(255, 99, 132)'
    }

    const thanksConfig: any = {
      label: 'Сказанные спасибо',
      color: 'rgb(54, 162, 235)'
    }

    this.aSub = this.service.getAnalytics().subscribe((data: AnalyticsPage) => {
      this.average = data.average

      ratioConfig.labels = data.chart.map(item => item.label)
      ratioConfig.data = data.chart.map(item => item.ratio)

      thanksConfig.labels = data.chart.map(item => item.label)
      thanksConfig.data = data.chart.map(item => item.thanks)

      // **** ratio ****
      // ratioConfig.labels.push('08.05.2018')
      // ratioConfig.labels.push('09.05.2018')
      // ratioConfig.data.push(1500)
      // ratioConfig.data.push(700)
      // **** /ratio ****

      // **** thanks ****
      // thanksConfig.labels.push('08.05.2018')
      // thanksConfig.labels.push('09.05.2018')
      // thanksConfig.data.push(8)
      // thanksConfig.data.push(2)
      // **** /thanks ****

      const ratioCtx = this.ratioRef.nativeElement.getContext('2d')
      const thanksCtx = this.thanksRef.nativeElement.getContext('2d')
      ratioCtx.canvas.height = '300px'
      thanksCtx.canvas.height = '300px'

      new Chart(ratioCtx, createChartConfig(ratioConfig))
      new Chart(thanksCtx, createChartConfig(thanksConfig))

      this.pending = false
    })
  }

  ngOnDestroy() {
    if (this.aSub) {
      this.aSub.unsubscribe()
    }
  }

}


function createChartConfig({labels, data, label, color}) {
  return {
    type: 'line',
    options: {
      responsive: true
    },
    data: {
      labels,
      datasets: [
        {
          label, 
          data,
          borderColor: color,
          steppedLine: false,
          fill: false
        }
      ]
    }
  }
}
