import { Component } from '@angular/core';
import { NavController, AlertController, MenuController, Events } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { HomePage } from '../home/home'
import { LocalStorage} from '../../service/storage.service'
import { DatabaseProvider } from '../../providers/database/database';



@Component({
    selector: 'page-login',
    templateUrl: 'login.html'
})
export class LoginPage {
	SolRealizadas: any;
    credenciales = { usuario: '', contrasena: '' };
    //UserNombre: String;


    constructor(public navCtrl: NavController, 
                public alertCtrl: AlertController,
                public events: Events,
                public BDMultas: DatabaseProvider,
                public http: Http, public menu: MenuController,private VGlobal: LocalStorage ) {
                        this.menu.enable(false);

                         if (this.VGlobal.getKey('UserLogin')!=null) {
                            this.navCtrl.setRoot(HomePage);
                         }

                 }



    iniciarSesion() {
    let Usuario = this.credenciales.usuario;
    let Password = this.credenciales.contrasena;
    this.http.get('https://satt.transporte.gob.hn:84/api_login.php?action=do-login&nombre='+Usuario+'&password='+Password+'').map(res => res.json()).subscribe(data => {
        this.SolRealizadas = data;
        console.warn(this.SolRealizadas[0].result);
    
        if (this.SolRealizadas[0].result==1) {
            let UserNombre = this.SolRealizadas[1]['perfil'].Nombre;
            let UserImagen = this.SolRealizadas[1]['imagen'].img;
            let Id_User = this.SolRealizadas[1].ID_Empleado;
            let IDArea = this.SolRealizadas[1]['ID_Area'].ID_Area;
            let Cargo = this.SolRealizadas[1]['ID_Area'].Cargo;
            localStorage.setItem('UserLogin', UserNombre);
            localStorage.setItem('ID_Empleado', Id_User);
            localStorage.setItem('IDArea', IDArea);
            localStorage.setItem('img', UserImagen);
            localStorage.setItem('Cargo', Cargo);


         //   this.events.publish('user: created', UserNombre, Date.now() ) 

        // let transactions = new Transaction(1,UserNombre, UserImagen);
        // transactions.save();

        this.BDMultas.ID_Empleado(Id_User)
            .then(response => {
            if (localStorage.getItem('UserLogin')!=null ) {
                // this.navCtrl.setRoot(HomePage);
                    window.location.reload();
            }
                
         }).catch( error => {
            console.error( error );
          })

       
       

        } else {
            let alert = this.alertCtrl.create({
                title: 'Error',
                subTitle: 'Usuario y/o contraseña incorrecta.',
                buttons: ['Salir']
            });
            alert.present(prompt);
        }

     });

    }
}
