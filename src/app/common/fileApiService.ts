import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileApiService  {

baseApiURL = "https://demo";

constructor(private http: HttpClient) {}

httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
})};



}
