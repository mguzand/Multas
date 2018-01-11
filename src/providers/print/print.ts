import { Injectable } from '@angular/core';
import {AlertController,LoadingController} from 'ionic-angular';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';
import { DatabaseProvider } from '../../providers/database/database';
import { HomePage } from '../../pages/home/home';

@Injectable()
export class PrintProvider {
  loading: any;

  constructor(
    private btSerial:BluetoothSerial,
    public BDMultas: DatabaseProvider,
    public loadingCtrl: LoadingController,
    private alertCtrl:AlertController) {}



  searchBt()
  {
    return this.btSerial.list();
  }

  connectBT(address)
  {
    return this.btSerial.connect(address);

  }
  
  ImprimirMulta(address,Multas){
  this.cargando2();
  let Data = [];
  this.BDMultas.Select_TB_MULTAS_Ipr(Multas)
  .then(Multa => {
    Data.push(Multa);
      var valor = {
        ID_Infraccion: Data[0].ID_Infraccion,
        N_Reincidencia: Data[0].N_Reincidencia
      }
    

        this.BDMultas.Valor_Reincidenci(valor)
        .then(valor => {
          Data.push({valor: valor});
          this.ImprimirMultaData(address, Data);
          
        })
        .catch( error => {
          console.error( error );
        });

  })
  .catch( error => {
    console.error( error );
  });
    
  
 }


 
 

 ImprimirMultaData(address,Multas)
 {
   
   var LINE_FEED = '\n'; 
   var CARRIAGE_RETURN = '\r';
   var laenie = '\u00f1';
   var certificado: any;

   var Data = {
     1: 'MUY GRAVE',
     2: 'GRAVE',
     3: 'LEVE'
  } 

  if(Multas[0].Certificado == null){
      certificado = 'N/D';
  }else{
      certificado = Multas[0].Certificado;
  }
  var Valor = Multas[1].valor;
  var valorcorto = Valor.toFixed(2);
  var valorcoma = new Intl.NumberFormat().format(valorcorto);


   var datos = "                 IHTT- HONDURAS"+ CARRIAGE_RETURN + LINE_FEED;


       datos += "               SISTEMA DE MULTAS " + CARRIAGE_RETURN + LINE_FEED +
   "                              "+Multas[0].ID_Multas +  CARRIAGE_RETURN + LINE_FEED+
   "                              05/01/2018 4:27PM"
   +CARRIAGE_RETURN + LINE_FEED+ LINE_FEED +LINE_FEED;



   datos += "DATOS DEL INFRACTOR ============================" + CARRIAGE_RETURN + LINE_FEED +
   "Nombre:        "+Multas[0].Nombre_Conductor + CARRIAGE_RETURN + LINE_FEED +
   "Identidad:     "+Multas[0].ID_Conductor+ CARRIAGE_RETURN + LINE_FEED+ LINE_FEED+ LINE_FEED;


   datos += "DATOS DE LA UNIDAD =============================" + CARRIAGE_RETURN + LINE_FEED +
   "Certificado:   "+certificado + CARRIAGE_RETURN + LINE_FEED +
   "Marca:         "+Multas[0].Marca + CARRIAGE_RETURN + LINE_FEED +
   "Color:         "+Multas[0].Color+ CARRIAGE_RETURN + LINE_FEED + CARRIAGE_RETURN +
   "VIN:           "+Multas[0].VIN + CARRIAGE_RETURN + LINE_FEED +
   "Placa:         "+Multas[0].Placa   + CARRIAGE_RETURN + LINE_FEED+ LINE_FEED+ LINE_FEED;


   datos += "DATOS DE LA INFRACCION =========================" + CARRIAGE_RETURN + LINE_FEED +
   "Falta:         "+Multas[0].N_Reincidencia+" Vez / "+Data[Multas[0].ID_Infraccion]+"" + CARRIAGE_RETURN + LINE_FEED +
   "Observacion:   "+Multas[0].Observacion+ CARRIAGE_RETURN + LINE_FEED + CARRIAGE_RETURN +
   CARRIAGE_RETURN + LINE_FEED+ LINE_FEED+ LINE_FEED;

   datos += '########### Valor:     L. '+valorcoma+'*  ###########'+ LINE_FEED+ LINE_FEED+ LINE_FEED

   datos +='En caso de decomiso de unidad, se impone un'+ LINE_FEED+' cobro por parqueo de L. 50.00 diarios'+ LINE_FEED+ LINE_FEED

   datos += "================================================\n\r";
   datos+= "Pagina web:       www.transporte.gon.hn"+ CARRIAGE_RETURN + LINE_FEED +
           "Email:            info@transporte.gob.hn"+ CARRIAGE_RETURN + LINE_FEED +
           "Telefonos: ====================================="+ CARRIAGE_RETURN + LINE_FEED +
           "Tegucigalpa:     2235 6319 / 2235 6330"+ CARRIAGE_RETURN + LINE_FEED +
           "Choluteca:       2780 5049"+ CARRIAGE_RETURN + LINE_FEED +
           "San Pedro Sula:  2250 0493"+CARRIAGE_RETURN + LINE_FEED;

   datos += "====================== UL ======================\n\r"+ LINE_FEED+ LINE_FEED+ LINE_FEED;









  
var printData = datos;
   
   let xyz=this.connectBT(address).subscribe(data=>{
     
     this.btSerial.write(printData).then(dataz=>{ 
      this.loading.dismiss();
       xyz.unsubscribe();
     },errx=>{
       console.log("WRITE FAILED",errx);
       let mno=this.alertCtrl.create({
         title:"ERROR "+errx,
         buttons:['Dismiss']
       });
       mno.present();
     });
     },err=>{
       console.log("CONNECTION ERROR",err);
       let mno=this.alertCtrl.create({
         title:"ERROR "+err,
         buttons:['Dismiss']
       });
       mno.present();
     });

 }


  
 public cargando2(){
  this.loading = this.loadingCtrl.create({
    content: 'Cargando',
    duration: 20000
  });
 this.loading.present();
}
  

}
