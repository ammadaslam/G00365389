import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class ItemsService {
  
  constructor(
    private _afStore : AngularFirestore
  ) { }

  getItems() {
    return this._afStore.collection('items').snapshotChanges();
  }

  async addItem(payload) {
    return await this._afStore.collection('items')
      .add({
        name        : payload.name,
        description : payload.description,
        disabled    : payload.disabled,
        file        : payload.file,
      }).then( result => {
        console.log(result)
        return result;
      })
  }

  getItemById(id) {
    return this._afStore.collection('items').doc(id).snapshotChanges();
  }
  
  async updateItem(payload) {
    return await this._afStore.collection('items').doc(payload.id).update({
      name        : payload.name,
      description : payload.description,
      disabled    : payload.disabled,
      file        : payload.file,
    }).then( result => {
      return result;
    })
  }

  async deleteItem(payload) {
    return await this._afStore.collection('items').doc(payload.id).delete();
  } 

}
