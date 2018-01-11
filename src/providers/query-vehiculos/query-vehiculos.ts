import { Injectable } from '@angular/core';

import { SQLiteObject } from '@ionic-native/sqlite';
import { LocalStorage } from '../../service/storage.service';

 
@Injectable()
export class QueryVehiculosProvider {

  private db_Multas: SQLiteObject = null;
  vehiculo: any;

  constructor(private SerCtrl: LocalStorage) {}

  setDatabase(db: SQLiteObject){
    if(this.db_Multas === null){
      this.db_Multas = db;
    }
  }



    //@@@@@@@@@@@@@@@@@@@@@@@@@@@    SELECT  TB_VEHICULO UNICO     @@@@@@@@@@@@@@@@@@@@@@@@@@@//
  Select_TB_VEHICULO_Unico() {
    let sql = 'SELECT CASE WHEN MAX (ID_Vehiculo) IS NULL THEN 0 ELSE MAX ( ID_Vehiculo)  END total FROM TB_Vehiculo';
    return this.db_Multas.executeSql(sql, [])
      .then(response => {
        if (response.rows.item(0).total != 0) {
          var array = response.rows.item(0).total.split("-");
          var sumaArray = parseInt(array[2]) + 1;
          if (sumaArray > 1000) {
            this.vehiculo = 'VHI-' + this.SerCtrl.getKey('ID_Empleado') + '-' + sumaArray;

          } else if (sumaArray > 100) {
            this.vehiculo = 'VHI-' + this.SerCtrl.getKey('ID_Empleado') + '-0' + sumaArray;

          } else if (sumaArray > 10) {
            this.vehiculo = 'VHI-' + this.SerCtrl.getKey('ID_Empleado') + '-00' + sumaArray;

          } else {
            this.vehiculo = 'VHI-' + this.SerCtrl.getKey('ID_Empleado') + '-000' + sumaArray;
          }
        } else {
          this.vehiculo = 'VHI-' + this.SerCtrl.getKey('ID_Empleado') + '-0001';
        }
        return Promise.resolve(this.vehiculo);
      })
      .catch(error => Promise.reject(error));
  }









  //@@@@@@@@@@@@@@@@@@@@@@@@@@@   CONSULTA SI EXISTE SI NO LO INSERTA   @@@@@@@@@@@@@@@@@@@@@@@@@@@//
  InsertConsultaVehiculo(p: any) {
    let sql = 'SELECT * FROM TB_Vehiculo WHERE Placa = ? ';
    return this.db_Multas.executeSql(sql, [p.Placa])
      .then(response => {
        if (response.rows.length == 0) {
          this.Select_TB_VEHICULO_Unico().then(result => {
            let sql2 = 'INSERT INTO TB_Vehiculo(ID_Vehiculo, VIN, Placa, Marca, Color, Modelo, ID_Sincronizar, Anio) VALUES(?,?,?,?,?,?,?,?)';
            this.db_Multas.executeSql(sql2, [result, p.VIN, p.Placa, p.Marca, p.Color, p.Modelo, p.ID_Sincronizar, p.Anio]);
            if(result!=undefined){
              return Promise.resolve(result);
            }

          })
        } else {
          return Promise.resolve(response.rows.item(0).ID_Vehiculo);
        }

      })
      .catch(error => Promise.reject(error));
  }
  









  
     //@@@@@@@@@@@@@@@@@@@@@@@@@@@    SELECT  TB_VEHICULO BUSQUEDA     @@@@@@@@@@@@@@@@@@@@@@@@@@@//
    Select_TB_VEHICULO_busqueda(Filtro: any){
    let sql = 'SELECT * FROM TB_Vehiculo WHERE Placa = ? ';
    return this.db_Multas.executeSql(sql, [Filtro])
    .then(response => {
      if(response.rows.length==0){
        return Promise.resolve( 0 );
      }else{
        return Promise.resolve( response.rows.item(0) );
      }
      
    })
    .catch(error => Promise.reject(error));
  }


  //@@@@@@@@@@@@@@@@@@@@@@@@@@@    INSERT  TB_VEHICULO   @@@@@@@@@@@@@@@@@@@@@@@@@@@//
  Insert_TB_Vehiculo(p: any){
    let sql = 'INSERT INTO TB_Vehiculo(ID_Vehiculo, VIN, Placa, Marca, Color, Modelo, ID_Sincronizar, Anio) VALUES(?,?,?,?,?,?,?,?)';
    return this.db_Multas.executeSql(sql, [p.ID_Vehiculo, p.VIN, p.Placa, p.Marca, p.Color, p.Modelo, p.ID_Sincronizar, p.Anio]);
  }





}
