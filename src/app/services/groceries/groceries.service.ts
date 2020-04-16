import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class GroceriesService {

  constructor(
    private _afStore : AngularFirestore
  ) { }

  getGroceries() {
    return this._afStore.collection('groceries').snapshotChanges();
  }

  async addGrocery(payload) {
    return await this._afStore.collection('groceries')
      .add({
        assignedTo  : payload.assignedTo,
        date        : payload.date,
        items       : payload.items,
        status      : payload.status,
      }).then( result => {
        console.log(result)
        return result;
      })
  }

  getGroceryById(id) {
    return this._afStore.collection('groceries').doc(id).snapshotChanges();
  }

  async updateGrocery(payload) {

    return await this._afStore.collection('groceries').doc(payload.id).update({
      assignedTo  : payload.assignedTo,
      date        : payload.date,
      items       : payload.items,
      status      : payload.status,
    }).then( result => {
      return result;
    })
  }

  async deleteGrocery(payload) {
    return await this._afStore.collection('groceries').doc(payload.id).delete();
  }

}
