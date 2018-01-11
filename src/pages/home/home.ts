import { Component } from '@angular/core';
import { PopoverController, NavController,MenuController, LoadingController,AlertController, Platform,Events } from 'ionic-angular';
import { NuevamultaPage } from '../nuevamulta/nuevamulta';
import { DetallecensoPage } from '../detallecenso/detallecenso';

import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { LocalStorage } from '../../service/storage.service';
import { PopoverPage } from '../popover/popover';
import { MultasincertificadoPage } from '../multasincertificado/multasincertificado';
import { ConsultamultasPage } from '../consultamultas/consultamultas';
import {PrintProvider} from '../../providers/print/print';

import { Http } from '@angular/http';




declare var navigator: any;
declare var Connection: any;


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  nmulta = NuevamultaPage;
  scannedCode = null;
  loading: any;
  Validation = null;
  nombres: any;
  selectedPrinter:any=[];
   public pieChartLabels:string[] = ['Download Sales', 'In-Store Sales', 'Mail Sales'];
  public pieChartData:number[] = [300, 500, 100];
  public pieChartType:string = 'pie';
 
  // events
  public chartClicked(e:any):void {
    console.log(e);
  }
 
  public chartHovered(e:any):void {
    console.log(e);
  }



  constructor(public navCtrl: NavController,
              private barcodeScanner: BarcodeScanner,
              public loadingCtrl: LoadingController,
              public http: Http,
              public platform: Platform,
              public alertCtrl: AlertController,
              public menu: MenuController,
              public events: Events,
              private popoverCtrl: PopoverController,
              private printProvider:PrintProvider,
              public Storage: LocalStorage) {
                this.menu.enable(true);


                events.subscribe('user:created', (user, time) => {
                  // user and time are the same arguments passed in `events.publish(user, time)`
                  console.log('Welcome', user, 'at', time);
                });

               // this.openNavDetailsPage();

  }
  presentPopover(myEvent) {
    let popover = this.popoverCtrl.create(PopoverPage);
    popover.present({
      ev: myEvent
    });
  }



  checkNetwork() {
        this.platform.ready().then(() => {
            var networkState = navigator.connection.type;
            var states = {};
            states[Connection.UNKNOWN]  = 'Unknown connection';
            states[Connection.ETHERNET] = 'Ethernet connection';
            states[Connection.WIFI]     = 'WiFi connection';
            states[Connection.CELL_2G]  = 'Cell 2G connection';
            states[Connection.CELL_3G]  = 'Cell 3G connection';
            states[Connection.CELL_4G]  = 'Cell 4G connection';
            states[Connection.CELL]     = 'Cell generic connection';
            states[Connection.NONE]     = 'No network connection';
            let alert = this.alertCtrl.create({
                title: "Connection Status",
                subTitle: states[networkState],
                buttons: ["OK"]
            });
            alert.present();


            



        });
    }



    ionViewDidLoad() {
      this.selectedPrinter = JSON.parse(localStorage.getItem("BtConfig"));
      this.VerificarMulta();
    }



    showPrompt($id) {
      if($id=='Placa'){
        $id = 'Placa';
      }else{
        $id = 'Certificado';
      }
      let prompt = this.alertCtrl.create({
        title: 'Buscar '+$id,
        inputs: [
          {
            name: 'title',
            placeholder: $id
          },
        ],
        buttons: [
          {
            text: 'Cancelar',
            handler: data => {
              
            }
          },
          {
            text: 'Buscar',
            handler: data => {
              this.BusquedaGeneral(data.title);
            }
          }
        ]
      });
      prompt.present();
    }

    



  showAlert() {
    let alert = this.alertCtrl.create({
      title: 'Censo no encontrado',
      subTitle: 'El código del censo no fue encontrado',
      buttons: ['OK']
    });
    alert.present();
  }

  scanCode() {
    this.barcodeScanner.scan().then(barcodeData => {
      this.scannedCode = barcodeData.text;
      var result = this.scannedCode.substr(58, 250);
      //alert(result);
      this.velidatecenso(result);
    
    }, (err) => {
        console.log('Error: ', err);
    });
  }

 public cargando(){
    this.loading = this.loadingCtrl.create({
      content: 'Cargando',
      duration: 10000
    });
   this.loading.present();
  }

  public cargando2(){
    this.loading = this.loadingCtrl.create({
      content: 'Cargando',
      duration: 2000
    });
   this.loading.present();
  }


  
  public BusquedaGeneral(id){
    console.log(id.replace(/\s/g, ''));
    this.cargando();
     this.http.get('http://satt.transporte.gob.hn:152/Api/Infomulta/busqueda/'+id.replace(/\s/g, '')+'').map(res => res.json()).subscribe(data => {
      this.loading.dismiss();
      localStorage.setItem('Censo', JSON.stringify(data));
      this.openNavDetailsPage(); 
      },
      error => {
        this.loading.dismiss();
        this.showAlert();
     });
     //this.openNavDetailsPage(); 
  }



  public velidatecenso(id){
    this.cargando();
     this.http.get('http://satt.transporte.gob.hn:152/Api/Infomulta/'+id+'').map(res => res.json()).subscribe(data => {
      this.loading.dismiss();
      localStorage.setItem('Censo', JSON.stringify(data));
      this.openNavDetailsPage(); 
      },
      error => {
        this.loading.dismiss();
        this.showAlert();
     });
     //this.openNavDetailsPage(); 
  }
  
  
  public VerificarMulta(){
    if(localStorage.getItem('ID_Multa').length > 2 ){
      this.ImprimirMulta(localStorage.getItem('ID_Multa'));
    }
  }

  ImprimirMulta(Multas: any){
    var id=this.selectedPrinter.id;
    if(id==null||id==""||id==undefined){
      //nothing happens, you can put an alert here saying no printer selected
    }else{
      let foo = this.printProvider.ImprimirMulta(id,Multas);
      localStorage.setItem('ID_Multa', '');
    }
  }


  public NewPage(){
     this.navCtrl.setRoot(NuevamultaPage);
  }

  public NewPageValidate(){
     //this.navCtrl.setRoot(ValidateqrPage);
  }

  openNavDetailsPage() {
    this.navCtrl.push(DetallecensoPage);
  }


  public NewPageMulta(){
    this.navCtrl.setRoot(MultasincertificadoPage);
 }

 public MultasRealizadas(){
  this.navCtrl.setRoot(ConsultamultasPage);
}

  


}
