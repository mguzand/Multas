import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';



////////////////////////////////////////////////////////////////////////////////
/////////////        COMPONENTES MANUEL GUZMAN                   ///////////////
////////////////////////////////////////////////////////////////////////////////
import {ChartsModule} from 'ng2-charts/charts/charts';
import '../../node_modules/chart.js/dist/Chart.bundle.min.js'; 
import { HttpModule } from '@angular/http';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';


////////////////////////////////////////////////////////////////////////////////
/////////////        COMPONENTES Geolocation                     ///////////////
////////////////////////////////////////////////////////////////////////////////
import { Geolocation } from '@ionic-native/geolocation';
import { LocationAccuracy } from '@ionic-native/location-accuracy';






////////////////////////////////////////////////////////////////////////////////
/////////////               SERVICES CREADOS MG                  ///////////////
////////////////////////////////////////////////////////////////////////////////
import { Geolocationservice } from '../service/geolocation.service';
import { LocalStorage } from '../service/storage.service';


////////////////////////////////////////////////////////////////////////////////
/////////////        COMPONENTES INSTALADOS CAMARA               ///////////////
////////////////////////////////////////////////////////////////////////////////
import { File } from '@ionic-native/file';
import { Transfer } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';



////////////////////////////////////////////////////////////////////////////////
/////////////                 PAGINAS AGREGADAS                  ///////////////
////////////////////////////////////////////////////////////////////////////////
import { NuevamultaPage } from '../pages/nuevamulta/nuevamulta';
import { DetallecensoPage } from '../pages/detallecenso/detallecenso';
import { ImprimirPage } from '../pages/imprimir/imprimir';
import { LoginPage } from '../pages/login/login';
import { PopoverPage } from '../pages/popover/popover';
import { MultasincertificadoPage } from '../pages/multasincertificado/multasincertificado';
import { ImprimirmultaPage } from '../pages/imprimirmulta/imprimirmulta';
import { ConsultamultasPage } from '../pages/consultamultas/consultamultas';
import { PrinterListModalPage } from '../pages/printer-list-modal/printer-list-modal';
import { ConfigPage } from '../pages/config/config';
import { ValormultaPage } from '../pages/valormulta/valormulta';



////////////////////////////////////////////////////////////////////////////////
/////////////              COMPONENTES SCANER QR                 ///////////////
////////////////////////////////////////////////////////////////////////////////
import { BarcodeScanner } from '@ionic-native/barcode-scanner';


////////////////////////////////////////////////////////////////////////////////
/////////////                COMPONENTES SQLITE                  ///////////////
////////////////////////////////////////////////////////////////////////////////
import { SQLite } from '@ionic-native/sqlite';
import { DatabaseProvider } from '../providers/database/database';
import { QueryVehiculosProvider } from '../providers/query-vehiculos/query-vehiculos';
import { ReincidenciasProvider } from '../providers/reincidencias/reincidencias';
import { PrintProvider } from '../providers/print/print';



@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    NuevamultaPage,
    DetallecensoPage,
    ImprimirPage,
    LoginPage,
    PopoverPage,
    MultasincertificadoPage,
    ImprimirmultaPage,
    ConsultamultasPage,
    ConfigPage,
    PrinterListModalPage,
    ValormultaPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
     ChartsModule,
     HttpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    NuevamultaPage,
    DetallecensoPage,
    ImprimirPage,
    LoginPage,
    PopoverPage,
    MultasincertificadoPage,
    ImprimirmultaPage,
    ConsultamultasPage,
    ConfigPage,
    PrinterListModalPage,
    ValormultaPage
  ],
  providers: [
    StatusBar,
    BluetoothSerial,
    SQLite,
    BarcodeScanner,
    SplashScreen,
    File,
    Transfer,
    Camera,
    FilePath,
    Geolocation,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    BarcodeScanner,
    Geolocationservice,
    LocalStorage,
    LocationAccuracy,
    DatabaseProvider,
    QueryVehiculosProvider,
    ReincidenciasProvider,
    PrintProvider
  ]
})
export class AppModule {}
