import { Component } from '@angular/core';
import { NavController, NavParams,ActionSheetController, ToastController, Platform,AlertController, LoadingController } from 'ionic-angular';


import { Camera, CameraOptions } from '@ionic-native/camera';
import { LocalStorage } from '../../service/storage.service'
// import { File } from '@ionic-native/file';
// import { Transfer, TransferObject } from '@ionic-native/transfer';
// import { FilePath } from '@ionic-native/file-path';

import { Http} from '@angular/http';
import 'rxjs/add/operator/map';

import { Geolocationservice } from '../../service/geolocation.service';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { ImprimirPage } from '../imprimir/imprimir';






@Component({
  selector: 'page-nuevamulta',
  templateUrl: 'nuevamulta.html',
})
export class NuevamultaPage {
  lastImage: string = null;


  Buscar: String;
  TInfraccion: String;
  Estado = '0';
  Unida:any;
  loading: any;
  DInfraccion:any; 
  Leves: any;
  Graves: any;
  MGraves: any;
  filename: any;
  
  lattitud:any;
  longitude: any;

  Nmultas = { Placa: '', 
              TipoInfraccion: '', 
              Descripcion: '', 
              Observacion: '' ,
              Certificado: '',

            };


  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public http: Http,

              private camera: Camera, 
              public alertCtrl: AlertController,
              public actionSheetCtrl: ActionSheetController, 
              public toastCtrl: ToastController, 
              public platform: Platform, 
              public loadingCtrl: LoadingController,
              private gps: Geolocationservice,
              public locac: LocationAccuracy,
              private SerCtrl: LocalStorage) {
  
  }


  


  ionViewWillEnter(){
    this.Buscar = '';
    this.Estado = '0';
    this.Nmultas.Placa = '';
    this.Nmultas.TipoInfraccion = '';
    this.Nmultas.Descripcion = '';
    this.Nmultas.Observacion = '';
    this.Nmultas.Certificado = '';
  }
 

  ionViewDidLoad() {
    this.longitude = '';
   // this.myapp.UpdateUser();

        




    this.gps.getlocation().then((resultado)=>{
        this.longitude = resultado.coords.longitude;
        this.lattitud  = resultado.coords.latitude;
    })


    this.locac.canRequest().then((res: boolean)=>{
       if (res) {
         this.locac.request(this.locac.REQUEST_PRIORITY_HIGH_ACCURACY).then(()=>{
             this.gps.getlocation().then((resultado)=>{
                this.longitude = resultado.coords.longitude;
                this.lattitud  = resultado.coords.latitude;
              })
         }, (error)=>{
            alert(error);
         })
       }
    })

  
        
  }


  
 public cargando(id){
       this.loading = this.loadingCtrl.create({
          content: 'Cargando',
          duration: 9000
        });


        this.loading.present();
        
     
      
    }

///////////////////////////////////////////////////////////////////
//////////     COMPONENTE PARA LA CAMARAS FUNCION PRINCIPAL ///////
///////////////////////////////////////////////////////////////////
    public TipoInfraccion(valor){
      this.cargando(0);
      this.TInfraccion = valor;
      this.http.get('https://satt.transporte.gob.hn:150/Certificado.php?action=get_infraccion&ID_Tipo='+this.TInfraccion+'').map(res => res.json()).subscribe(data => {
      this.DInfraccion = data[0];
      this.loading.dismiss();

      });
    }
    
    public FiltroGeneral(){
      this.cargando(0);
      let Buscaqueda = this.Buscar;
       this.http.get('https://satt.transporte.gob.hn:150/Certificado.php?action=Get-Certificado&Cert='+Buscaqueda.replace(/\s/g, '')+'').map(res => res.json()).subscribe(data => {
         this.Unida = data.Data; 
         this.Leves = data.Infraccion[0]['LEVES'];
         this.Graves = data.Infraccion[0]['GRAVES'];
         this.MGraves = data.Infraccion[0]['MGRAVES'];
         
          if (this.Unida!=0) {
             this.loading.dismiss();
             this.Nmultas.Placa = this.Unida[0]['n_placa'];
             this.Nmultas.Certificado = this.Unida[0]['certificado'];
             localStorage.setItem('Multa', JSON.stringify(data.Data[0]));
             this.Estado = '1'; 
          }else{
            this.loading.dismiss();
            this.Estado = '3'; 
          }
          
       });
    }
///////////////////////////////////////////////////////////////////
//≤≤≤≤≤≤≤≤≤≤≤≤≤≤≤≤≤≤≤≤≤≤≤≤≤≤≤≤≤≤≤≤≤≤≤≤≤≤≤≤≤≤≤≤≤≤≤≤≤≤≤≤≤≤≤≤≤≤≤≤≤≤//



///////////////////////////////////////////////////////////////////
//////////     GUARDAR MULTA SIN UNA IMAGEN  DE RESPALDO    ///////
///////////////////////////////////////////////////////////////////
public SaveNuevaMultas(){
  alert(this.lastImage);
     this.cargando(0);
       let optiones = 'Placa='+this.Nmultas.Placa+'&Certificado='+this.Nmultas.Certificado+'&TipoInfraccion='+this.TInfraccion+'&DescripcionTipo='+this.Nmultas.Descripcion+'&Observacion='+this.Nmultas.Observacion
       this.http.get('https://satt.transporte.gob.hn:150/ValidateCenso.php?action=Get-MultasSave&'+optiones+'').map(res => res.json()).subscribe(data => {
       this.loading.dismiss();
     });

}

public SaveNuevaMulta(){

}

/*
public SaveNuevaMulta(){
  if(this.longitude == ''){
    alert('Active su GPS');
  }

  this.cargando(0);
  let  POSTDATA = {
    action: 'SaveMulta',
    Placa: this.Nmultas.Placa,
    TipoInfraccion: this.TInfraccion,
    Descripcion: this.Nmultas.Descripcion,
    Observacion: this.Nmultas.Observacion,
    Certificado: this.Nmultas.Certificado,
    leves: this.Leves,
    graves: this.Graves,
    mgraves: this.MGraves,
    Latitud: this.lattitud,
    Longitude: this.longitude,
    Usuario: this.SerCtrl.getKey('ID_Empleado')

  };
   let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let data=JSON.stringify(POSTDATA);
    this.http.post('https://satt.transporte.gob.hn:150/SaveMultas.php',data,headers)
      .map(res => res.json())
      .subscribe(res => {
      if (res['status']==1) {
        this.loading.dismiss();
        console.log(res);
        localStorage.setItem('IDMulta', res['multa']);
        this.openNavDetailsPage();
      }
      if (res['status']==2) {
        let alert = this.alertCtrl.create({
          title: 'Error al Guardar',
          subTitle: 'Usted no se encuentra en ningun operativo asignado para el dia de hoy',
          buttons: ['OK']
        });
        alert.present();
      }


    }, (err) => {
    alert("Error al guardar");
    this.loading.dismiss();
    });




}

*/


///////////////////////////////////////////////////////////////////
//////////     COMPONENTE PARA LA CAMARAS FUNCION PRINCIPAL ///////
///////////////////////////////////////////////////////////////////

 public imagendata(){
   const options: CameraOptions = {
      quality: 40,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      saveToPhotoAlbum: true
    }

    this.camera.getPicture(options).then((imageData) => {
     // imageData is either a base64 encoded string or a file URI
     // If it's base64:
     let base64Image = 'data:image/jpeg;base64,' + imageData;
      this.lastImage = base64Image;
    }, (err) => {
     // Handle error
    });
 }




openNavDetailsPage() {
    this.navCtrl.push(ImprimirPage);
  }







     
   




}
