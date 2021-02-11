import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Good, Message } from '../interfaces';

@Injectable({
    providedIn: 'root'
})
export class GoodsService {
    constructor(private http: HttpClient) {

    }

    fetch(welldoerId: string): Observable<Good[]> {
        return this.http.get<Good[]>(`/api/good/${welldoerId}`);
    }

    create(good: Good): Observable<Good> {
        return this.http.post<Good>('/api/good', good)
    }

    update(good: Good): Observable<Good> {
        return this.http.patch<Good>(`/api/good/${good._id}`, good)
    }

    delete(good: Good): Observable<Message> {
        return this.http.delete<Message>(`/api/good/${good._id}`)
    }
}