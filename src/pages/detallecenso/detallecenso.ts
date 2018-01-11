import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Http,Headers} from '@angular/http';
import 'rxjs/add/operator/map';

@IonicPage()
@Component({
  selector: 'page-detallecenso',
  templateUrl: 'detallecenso.html',
})
export class DetallecensoPage {
  DMulta: any;
  Multas = JSON.parse(localStorage.getItem("Censo"));
  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public http: Http) {

    this.http.get('https://satt.transporte.gob.hn:150/Appi_Operativos?action=MultasActivas&Placa='+this.Multas['Placa']+'&Certificado='+this.Multas['Certificado_Operacion']+'').map(res => res.json()).subscribe(data => {
    this.DMulta = data[0];
     console.log(this.DMulta);
    });


  }

  ionViewDidLoad() {
    console.log('censo',);
  }
 
  
  public Detallecenso(){
 
  }



}
