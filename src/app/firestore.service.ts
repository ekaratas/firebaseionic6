import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(private firestore: AngularFirestore) { }



  yeniKayit(kayit) {
    return this.firestore.collection('AlisverisListesi').add(kayit);
 
     //return this.firestore.doc<any>('kullanicilar/' + user).collection('AlisverisListesi').add(kayit);
   }

   kayitlariOku() {
    return this.firestore.collection('AlisverisListesi', sirala => sirala.orderBy('tarih','desc')).snapshotChanges();
   // return this.firestore.doc<any>('kullanicilar/' + user).collection('AlisverisListesi').snapshotChanges();
  }

  kayitGuncelle(kayit_id, kayit) {

   return this.firestore.doc('AlisverisListesi/' + kayit_id).update(kayit);

    //this.firestore.doc('kullanicilar/' + user + '/AlisverisListesi/' + kayit_id).update(kayit);
  }

  kayitSil(kayit_id) {
    return this.firestore.doc('AlisverisListesi/' + kayit_id).delete();
    //this.firestore.doc('kullanicilar/' + user + '/AlisverisListesi/' + kayit_id).delete();
  }



}
