import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,PopoverController,LoadingController,AlertController } from 'ionic-angular';
import { LocalStorage } from '../../service/storage.service'
import { PopoverPage } from '../popover/popover';
import { Http,Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import { ImprimirmultaPage } from '../imprimirmulta/imprimirmulta';
import { DatabaseProvider } from '../../providers/database/database';
import { QueryVehiculosProvider } from '../../providers/query-vehiculos/query-vehiculos';
import { ReincidenciasProvider } from '../../providers/reincidencias/reincidencias';
import { HomePage } from '../home/home';



 
@IonicPage()
@Component({
  selector: 'page-multasincertificado',
  templateUrl: 'multasincertificado.html',
})
export class MultasincertificadoPage {
  Placa: any;
  loading: any;
  Leves: any;
  Graves: any;
  MGraves: any;
  Estado = '0';
  Unida:any;
  DInfraccion:any; 
  TInfraccion: String;
  lattitud:any;
  longitude: any;

  testCheckboxOpen: boolean;
  testCheckboxResult;
  EstadoVehiculo: any;
  IDMulta: any;
  ID_Vehiculo: any;
  VHI: any;
  


  Nmultas = { 
              VIN: '', 
              Marca: '', 
              Color: '' ,
              Anio: '',
              Modelo: '',
              Descripcion: '', 
              Observacion: '' ,
              Certificado: '',

              Nombre: '',
              Identidad: '',
              Vehiculo:'',
              Documentos:'',



          };
  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private popoverCtrl: PopoverController,
              public loadingCtrl: LoadingController,
              private SerCtrl: LocalStorage,
              public alertCtrl: AlertController,
              public BDMultas: DatabaseProvider,
              public Qvehiculo: QueryVehiculosProvider,
              public Qreincide: ReincidenciasProvider,
              public http: Http) {
                
  }

  ionViewDidLoad() {
    this.ver();
    this.Reinicide();
  }

public ver(){
  this.Qvehiculo.Select_TB_VEHICULO_Unico()
  .then(response => {
    this.ID_Vehiculo = response;
    console.log(this.ID_Vehiculo);
  })
  .catch(error => {
    console.error(error);
  });
}


public Reinicide(){
  this.Qreincide.SelectAll()
  .then(response => {
     console.log(response);
  })
  .catch(error => {
    console.error(error);
  });
}


  

  public TipoInfraccion(valor){
    this.cargando(0);
    this.TInfraccion = valor;
    this.http.get('https://satt.transporte.gob.hn:150/Certificado.php?action=get_infraccion&ID_Tipo='+this.TInfraccion+'').map(res => res.json()).subscribe(data => {
    this.DInfraccion = data[0];
    this.loading.dismiss();

    });
  }


  BuscarPlacas() {
    this.cargando(0);
    let Buscaqued = this.Placa.replace(/[ -]/g, '');
    let Buscaqueda = Buscaqued.toUpperCase();
    this.Qvehiculo.Select_TB_VEHICULO_busqueda(Buscaqueda)
      .then(response => {
        console.log(response);
        if (response != 0) {
          this.EstadoVehiculo = 1;
          this.Nmultas.VIN = response.VIN;
          this.Nmultas.Marca = response.Marca;
          this.Nmultas.Anio = response.Anio;
          this.Nmultas.Modelo = response.Modelo;
          this.Nmultas.Color = response.Color;
          this.loading.dismiss();
          this.Estado = '1';
          this.SelecReincide(Buscaqueda);
        } else {
          this.SelecReincide(Buscaqueda);
          this.Estado = '1';
          this.EstadoVehiculo = 0;
          this.Nmultas.VIN = '';
          this.Nmultas.Marca = '';
          this.Nmultas.Anio = '';
          this.Nmultas.Modelo = '';
          this.Nmultas.Color = '';
          this.loading.dismiss();
        }
        console.log(this.EstadoVehiculo);
      })
      .catch(error => {
        console.error(error);
        this.loading.dismiss();
      });
  }


  public SelecReincide(P){
    this.Qreincide.SelectReincidencia(P)
    .then(response => {
       console.log(response);
       this.Leves = response.LEVES;
       this.Graves = response.GRAVES;
       this.MGraves = response.MGRAVES;
    });
  }



   public SaveNuevaMulta(){

     this.BDMultas.Select_TB_MULTAS_Unico().then(response => {
       var result = response.total;
       if (result != 0) {
         var array = result.split("-");
         var sumaArray = parseInt(array[2]) + 1;
         if (sumaArray > 1000) {
           this.IDMulta = 'MULTA-' + this.SerCtrl.getKey('ID_Empleado') + '-' + sumaArray;

         } else if (sumaArray > 100) {
           this.IDMulta = 'MULTA-' + this.SerCtrl.getKey('ID_Empleado') + '-0' + sumaArray;

         } else if (sumaArray > 10) {
           this.IDMulta = 'MULTA-' + this.SerCtrl.getKey('ID_Empleado') + '-00' + sumaArray;

         } else {
           this.IDMulta = 'MULTA-' + this.SerCtrl.getKey('ID_Empleado') + '-000' + sumaArray;
         }
       } else {
         this.IDMulta = 'MULTA-' + this.SerCtrl.getKey('ID_Empleado') + '-0001';
       }
    


    
    let Placas = this.Placa.replace(/[ -]/g, '');
    let Placa = Placas.toUpperCase();
    let DATAVEHICULO = {
        VIN: this.Nmultas.VIN, 
        Placa: Placa, 
        Marca: this.Nmultas.Marca, 
        Color: this.Nmultas.Color, 
        Modelo: this.Nmultas.Modelo, 
        ID_Sincronizar: '1',
        Anio:  this.Nmultas.Anio, 
    };
    this.Qvehiculo.InsertConsultaVehiculo(DATAVEHICULO).then( data =>{ //INSERT DE VEHICULO
        if(this.EstadoVehiculo==0){
          this.VHI = this.ID_Vehiculo;
        }else{
          this.VHI = data;
        }
      console.log(this.VHI);

       let POSTDATA = {
         ID_Multas: this.IDMulta,
         ID_Operativo: this.SerCtrl.getKey('ID_Empleado'),
         Observacion: this.Nmultas.Observacion,
         Latitud: '14.090959',
         Longitud: '-87.192763',
         ID_Vehiculo: this.VHI,

         //DATOS DEL CONDUCTOR //
         Nombre_Conductor: this.Nmultas.Nombre,
         ID_Conductor: this.Nmultas.Identidad.replace(/[ -]/g, ''),
         ID_Sincronizar: 1
       };

       this.BDMultas.Insert_TB_Multas(POSTDATA).then(response => {
          
        let DataInfraccion = {
          Placa: Placa, 
          Vin: this.Nmultas.VIN, 
          Certificado: null, 
          ID_Multa: this.IDMulta, 
          ID_Infraccion: this.TInfraccion,
          Descripcion: this.Nmultas.Descripcion,
          ID_Sub_Reincidencia: this.TInfraccion, 
          User: this.SerCtrl.getKey('ID_Empleado'),

          leves: this.Leves,
          graves: this.Graves,
          mgraves: this.MGraves 
        };

        this.Qreincide.InsertInfraccion(DataInfraccion).then(res => {
          localStorage.setItem('ID_Multa', this.IDMulta);
          this.openNavDetailsPage();
        }).catch(error => {
          console.error(error);
        });


           

       }) .catch(error => {
           console.error(error);
       });



    }).catch(error => {
           console.error(error);
    }); //INSERT DE VEHICULO



     });

   }


  //  getAllTasks(){
  //   this.BDMultas.Select_TB_MULTAS()
  //   .then(Multas => {
  //     console.log(Multas);
  //     this.Multas = Multas;
  //   })
  //   .catch( error => {
  //     console.error( error );
  //   });
  // }



   public cargando(id){
    this.loading = this.loadingCtrl.create({
       content: 'Cargando',
       duration: 9000
     });
     this.loading.present();  
  }


  presentPopover(myEvent) {
    let popover = this.popoverCtrl.create(PopoverPage);
    popover.present({
      ev: myEvent
    });
  }


  openNavDetailsPage() {
    this.navCtrl.setRoot(HomePage);
  }








}
