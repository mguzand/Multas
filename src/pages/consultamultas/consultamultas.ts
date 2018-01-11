import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,PopoverController } from 'ionic-angular';

import { PopoverPage } from '../popover/popover';
import { DatabaseProvider } from '../../providers/database/database';
import {PrintProvider} from '../../providers/print/print';

@IonicPage()
@Component({
  selector: 'page-consultamultas',
  templateUrl: 'consultamultas.html',
})
export class ConsultamultasPage {
  Multas: any[] = [];
  selectedPrinter:any=[];
  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private printProvider:PrintProvider,
              private popoverCtrl: PopoverController,
              public BDMultas: DatabaseProvider) {
  }

  ionViewDidLoad() {
   this.getAllTasks();
   this.selectedPrinter = JSON.parse(localStorage.getItem("BtConfig"));
  }


  presentPopover(myEvent) {
    let popover = this.popoverCtrl.create(PopoverPage);
    popover.present({
      ev: myEvent
    });
  }

  getAllTasks(){
    this.BDMultas.Select_TB_MULTAS()
    .then(Multas => {
      console.log(Multas);
      this.Multas = Multas;
    })
    .catch( error => {
      console.error( error );
    });
  }

  deleteTask(task: any, index){
    console.log(task);
    this.BDMultas.delete(task)
    .then(response => {
      console.log( response );
      this.Multas.splice(index, 1);

    })
    .catch( error => {
      console.error( error );
    })
  }

  ImprimirMulta(Multas: any)
  {
    var id=this.selectedPrinter.id;
    if(id==null||id==""||id==undefined)
    {
      //nothing happens, you can put an alert here saying no printer selected
    }
    else
    {
      let foo = this.printProvider.ImprimirMulta(id,Multas);
    }
  }


}
