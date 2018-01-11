import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';

import { Http } from '@angular/http';
import 'rxjs/add/operator/map';



@IonicPage()
@Component({
  selector: 'page-imprimirmulta',
  templateUrl: 'imprimirmulta.html',
})
export class ImprimirmultaPage {
  Infraccion: any;
	N_Reincidencia: any;
	Observacion: any;
	fecha: any;
	img: any;
	valor: any;
  multa: any;
  Multas = JSON.parse(localStorage.getItem("Multa"));

  constructor(public http: Http) {
  }

  ionViewDidLoad() {
    //console.log('entro al documento ');
    this.multa = localStorage.getItem("IDMulta");
    this.http.get('https://satt.transporte.gob.hn:150/ValidateCenso.php?action=Get-detalle-Multa&Muta='+this.multa+'').map(res => res.json()).subscribe(data => {
    this.Infraccion = data['Multa']['Infraccion'];
    this.N_Reincidencia = data['Multa']['N_Reincidencia'];
    this.Observacion = data['Multa']['Observacion'];
    this.img = data['Multa']['img'];
    this.valor = data['Multa']['Valor'];
    this.fecha = data['Multa']['fecha'];
      

    });
  }

}








