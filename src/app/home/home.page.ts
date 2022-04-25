import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../firestore.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';




@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{

  kayitlar:any;

  urunBilgi = {'urun':'','adet':'','kisi':'','tarih':null};


  constructor(private servis: FirestoreService, private router: Router, private alertController:AlertController, private toastController:ToastController) {}

  ngOnInit() {
    this.listele();
  }

  async listele() {
    await this.servis.kayitlariOku().subscribe((data:any) => {
      this.kayitlar = data; 
      console.log(data)
    },  error => {});
  }


  async yeniKayit(){

    this.urunBilgi.tarih = Math.floor(Date.now() /  1000);

    await this.servis.yeniKayit(this.urunBilgi).then(sonuc=> {

      this.urunBilgi.adet = '';
      this.urunBilgi.kisi = '';
      this.urunBilgi.urun = '';
      this.urunBilgi.tarih = null;
      this.presentToast('Yeni Kayıt Eklendi!');

    }).catch(error => { console.log(error);
    });
    
}

kayitDuzenle(kayit) {
  kayit.guncelleniyor = true;
  kayit.gUrun = kayit.payload.doc.data().urun;
  kayit.gAdet = kayit.payload.doc.data().adet;
  kayit.gKisi = kayit.payload.doc.data().kisi;
}

kayitGuncelle(kayit) {

  if (kayit.gUrun == kayit.payload.doc.data().urun && kayit.gAdet == kayit.payload.doc.data().adet && kayit.gKisi == kayit.payload.doc.data().kisi)
  console.log('hiçbir veri değişmedi');
  else
  {
    this.urunBilgi.adet = kayit.gAdet;
    this.urunBilgi.kisi = kayit.gKisi;
    this.urunBilgi.urun = kayit.gUrun;


    this.servis.kayitGuncelle(kayit.payload.doc.id, this.urunBilgi).then(sonuc=>{
    kayit.guncelleniyor = false;
    this.presentToast('Kayıt Güncellendi!');
  });
}
}

kayitSil(id) {
  this.servis.kayitSil(id).then( ()=>{this.presentToast('Kayıt Silindi!');}).catch(err=>{console.log(err);});
}


async presentAlertConfirm(id) {
  const alert = await this.alertController.create({
    cssClass: 'my-custom-class',
    header: 'Kayıt Sil',
    message: 'Bu kaydı silmek istiyor musunuz?',
    buttons: [
      {
        text: 'Vazgeç',
        role: 'cancel',
        cssClass: 'secondary',
        handler: (blah) => {
          console.log('Confirm Cancel: blah');
        }
      }, {
        text: 'Sil',
        handler: () => {
          this.kayitSil(id);
        }
      }
    ]
  });

  await alert.present();
}

async presentToast(msg) {
  const toast = await this.toastController.create({
    message: msg,
    duration: 2000
  });
  toast.present();
}


}
