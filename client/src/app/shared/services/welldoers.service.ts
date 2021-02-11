import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Welldoer, Message } from '../interfaces';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class WelldoersService {
    constructor(private http: HttpClient) {

    }

    fetch(): Observable<Welldoer[]> {
        return this.http.get<Welldoer[]>('/api/welldoer')
    }

    getById(id: string): Observable<Welldoer> {
        return this.http.get<Welldoer>(`/api/welldoer/${id}`)
    }

    create(name: string, image?: File): Observable<Welldoer> {
        const fd = new FormData()
    
        if (image) {
          fd.append('image', image, image.name)
        }
        fd.append('name', name)
    
        return this.http.post<Welldoer>('/api/welldoer', fd)
    }
    
    update(id: string, name: string, image?: File): Observable<Welldoer> {
        const fd = new FormData()
    
        if (image) {
          fd.append('image', image, image.name)
        }
        fd.append('name', name)
        return this.http.patch<Welldoer>(`/api/welldoer/${id}`, fd)
    }
    
    delete(id: string): Observable<Message> {
      return this.http.delete<Message>(`/api/welldoer/${id}`)
    }
    
}