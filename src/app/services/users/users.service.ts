import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(
    private _http : HttpClient
  ) { }

  getUsers() {
    return this._http.get('https://reqres.in/api/users').toPromise().then( response => {
      console.log(response)
      return response['data'];
    })
  }
}
