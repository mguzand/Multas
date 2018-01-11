import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ImprimirPage } from './imprimir';

@NgModule({
  declarations: [
    ImprimirPage,
  ],
  imports: [
    IonicPageModule.forChild(ImprimirPage),
  ],
})
export class ImprimirPageModule {
}
