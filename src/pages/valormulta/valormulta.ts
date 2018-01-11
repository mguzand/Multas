import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,PopoverController,LoadingController,AlertController } from 'ionic-angular';
import { Http,Headers} from '@angular/http';
import { DatabaseProvider } from '../../providers/database/database';



@IonicPage()
@Component({
  selector: 'page-valormulta',
  templateUrl: 'valormulta.html',
})
export class ValormultaPage {

  loading: any;
  DataValor: any;
  Valores: any[] = [];

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private popoverCtrl: PopoverController,
              public loadingCtrl: LoadingController,
              public alertCtrl: AlertController,
              public BDMultas: DatabaseProvider,
              public http: Http) {
  }

  ionViewDidLoad() {
    this.getAllTasks();
  }


  public TipoInfraccion(){
    this.cargando(0);
    this.http.get('https://satt.transporte.gob.hn:150/Certificado.php?action=UpdatesGetMultas').map(res => res.json()).subscribe(data => {
      this.DataValor = '';
      if(data[0].length > 0){
        this.BDMultas.DeleteValore()
        .then(response => {
          for (var i = 0; i < data[0].length; i++) {

            this.BDMultas.Valores(data[0][i])
               .then(response => {
                 console.log( 'Bien' );
               }).catch( error => {
               console.error( error );
            })
   
         }


        }).catch( error => {
            console.error( error );
        })
      }
      
    
      console.log(this.DataValor);
      this.loading.dismiss();

      });
  }
  

  getAllTasks(){
    this.BDMultas.Select_Valores()
    .then(Valor => {
      console.log(Valor);
      this.Valores = Valor;
    })
    .catch( error => {
      console.error( error );
    });
  }


  public cargando(id){
    this.loading = this.loadingCtrl.create({
       content: 'Cargando',
       duration: 9000
     });
     this.loading.present();  
  }




}
