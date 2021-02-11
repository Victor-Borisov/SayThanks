import {HttpClient, HttpParams} from '@angular/common/http'
import {Injectable} from '@angular/core'
import {Thank} from '../interfaces'
import {Observable} from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class ThankService {
  constructor(private http: HttpClient) {
  }


  fetch(): Observable<Thank> {
    return this.http.get<Thank>('/api/thank')
  }

  updateByGood(thank_id: string, good_id: string): Observable<Thank> {
    return this.http.patch<Thank>(`/api/thank/${thank_id}`, {"good_id": good_id})
  }

  updateByWelldoer(thank_id: string, welldoer_id: string): Observable<Thank> {
    return this.http.patch<Thank>(`/api/thank/${thank_id}`, {"welldoer_id": welldoer_id})
  }

  getAll(params: any = {}): Observable<Thank[]> {
    return this.http.get<Thank[]>('/api/thank/history', {
      params: new HttpParams({
        fromObject: params
      })
    })
  }
    
}
