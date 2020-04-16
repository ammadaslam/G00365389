import { Injectable } from '@angular/core';
import * as uuid from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class UuidService {

  constructor() { }

  generateUUID() {
    return uuid.v4();
  }

}
