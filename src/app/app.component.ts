import { Component, ViewChild } from '@angular/core';
import {Nav, Platform, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HomePage } from '../pages/home/home';

import { NuevamultaPage } from '../pages/nuevamulta/nuevamulta';

import { LocalStorage } from '../service/storage.service';
import { LoginPage } from '../pages/login/login';
import { SQLite } from '@ionic-native/sqlite';
import { DatabaseProvider } from '../providers/database/database';
import { QueryVehiculosProvider } from '../providers/query-vehiculos/query-vehiculos';
import  { ReincidenciasProvider } from '../providers/reincidencias/reincidencias';
import { ConfigPage } from '../pages/config/config';
import { ValormultaPage } from '../pages/valormulta/valormulta';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage:any;
  nombres: any;
  Cargo: any;
  foto: any;

  pages: Array<{title: string, component: any}>;

  constructor(platform: Platform,
              public DataTables: DatabaseProvider,
              public DataTablesV: QueryVehiculosProvider, 
              public DataReincide: ReincidenciasProvider,
              statusBar: StatusBar, 
              splashScreen: SplashScreen,
              public sqlite: SQLite,
              VGlobal : LocalStorage, public events: Events) {
              this.rootPage = LoginPage;

              
              this.nombres = VGlobal.getKey('UserLogin');
              this.Cargo = VGlobal.getKey('Cargo');
              this.foto = VGlobal.getKey('img');

    platform.ready().then(() => {
      
      statusBar.styleDefault();
      splashScreen.hide();
      this.createDatabase();
      
    });

    this.pages = [
      { title: 'Inicio', component: HomePage },
      { title: 'Realizar Multa', component: NuevamultaPage },
      { title: 'Configurar Impresora', component: ConfigPage },
      { title: 'Configurar Valor', component: ValormultaPage }
    ];


  }

private createDatabase(){
    this.sqlite.create({
      name: 'IHTT_Multas.db',
      location: 'default'  
    })
    .then((db) => {
      this.DataTables.setDatabase(db);
      this.DataTablesV.setDatabase(db);
      this.DataReincide.setDatabase(db);
      return this.DataTables.createTable();
    })
    .catch(error =>{
      console.error(error);
    });
  }

CerrarSesion(){
  localStorage.clear();
  this.nav.setRoot(LoginPage);
}
openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  



}
