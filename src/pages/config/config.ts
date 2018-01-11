import { Component } from '@angular/core';
import { NavController,ModalController,AlertController} from 'ionic-angular';

import {PrintProvider} from '../../providers/print/print';
import {PrinterListModalPage} from '../printer-list-modal/printer-list-modal';




@Component({
  selector: 'page-config',
  templateUrl: 'config.html',
})
export class ConfigPage {
  selectedPrinter:any=[];

  constructor(
    public navCtrl: NavController,private modalCtrl:ModalController,
    private printProvider:PrintProvider,
    private alertCtrl:AlertController) {
  }

  ionViewDidLoad() {
    this.selectedPrinter = JSON.parse(localStorage.getItem("BtConfig"))
  }


  listBTDevice()
  {
    this.printProvider.searchBt().then(datalist=>{
      
      //1. Open printer select modal
      let abc=this.modalCtrl.create(PrinterListModalPage,{data:datalist});
      
      //2. Printer selected, save into this.selectedPrinter
      abc.onDidDismiss(data=>{
        this.selectedPrinter=data;
        localStorage.setItem('BtConfig', JSON.stringify(data));

        console.log(data);

        let xyz=this.alertCtrl.create({
          title: data.name+" Seleccionado",
          buttons:['Ok']
        });
        xyz.present();

      });
      
      //0. Present Modal
      abc.present();

    },err=>{
      console.log("ERROR",err);
      let mno=this.alertCtrl.create({
        title:"ERROR "+err,
        buttons:['Dismiss']
      });
      mno.present();
    })

  }

  

}
