import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';


import { SQLiteObject } from '@ionic-native/sqlite';


@Injectable()
export class DatabaseProvider {
  private db_Multas: SQLiteObject = null;
  vehiculo: any;
  constructor(public http: Http) {
  }


  setDatabase(db: SQLiteObject){
    if(this.db_Multas === null){
      this.db_Multas = db;
    }
  }


  createTable(){
    ////////////////////////////////////////////////////////////////////////////////
    /////////////              CREAR TABLA TB_MULTAS                 ///////////////
    ////////////////////////////////////////////////////////////////////////////////
    var sql = 'CREATE TABLE IF NOT EXISTS TB_Multas("ID_Multas" text NOT NULL, "ID_Operativo" text NOT NULL, "Observacion" text, "Latitud" text, "Longitud" text, "ID_Conductor" text, "Nombre_Conductor" text, "ID_Vehiculo" text, "ID_Sincronizar" integer, "User" text); ';
    ////////////////////////////////////////////////////////////////////////////////
    /////////////             CREAR TABLA TB_VEHICULO                ///////////////
    ////////////////////////////////////////////////////////////////////////////////
    var sql2 = 'CREATE TABLE IF NOT EXISTS TB_Vehiculo("ID_Vehiculo" text NOT NULL, "VIN" text, "Placa" text, "Marca" text, "Color" text, "Modelo" text, "ID_Sincronizar" integer NOT NULL, "Anio" text, "User" text); ';
    ////////////////////////////////////////////////////////////////////////////////
    /////////////             CREAR TABLA REINCIDENCIAS              ///////////////
    ////////////////////////////////////////////////////////////////////////////////
    var sql3 = 'CREATE TABLE IF NOT EXISTS TB_Reincidencia("ID_Reincidencia" text NOT NULL, "Placa" text, "Vin" text, "Certificado" text, "ID_Multa" text NOT NULL, "ID_Infraccion" text NOT NULL, "N_Reincidencia" text NOT NULL, "ID_Estado" text, "ID_Sub_Reincidencia" text, "ID_Sincronizar" integer, "User" text); ';
    ////////////////////////////////////////////////////////////////////////////////
    /////////////                 CREAR TABLA EMPLEADO               ///////////////
    ////////////////////////////////////////////////////////////////////////////////
    var sql4 = 'CREATE TABLE IF NOT EXISTS TB_Empleado("ID_Empleado" text NOT NULL); ';
    ////////////////////////////////////////////////////////////////////////////////
    /////////////            CREAR TABLA VALORES MULTAS              ///////////////
    ////////////////////////////////////////////////////////////////////////////////
    var sql5 = 'CREATE TABLE IF NOT EXISTS TB_Valores("ID_Tipo" text NOT NULL, "N_Incidencia" text NOT NULL, "Proporcion_Minimo" text NOT NULL , "Valor" text NOT NULL); ';



    this.db_Multas.executeSql(sql, []);
    this.db_Multas.executeSql(sql2, []);
    this.db_Multas.executeSql(sql3, []);
    this.db_Multas.executeSql(sql4, []);
    this.db_Multas.executeSql(sql5, []);


    
  }

//@@@@@@@@@@@@@@@@@@@@@@@@@@@    INSERT  TB_MULTAS    @@@@@@@@@@@@@@@@@@@@@@@@@@@//
  Insert_TB_Multas(p: any){
    let sql = 'INSERT INTO TB_Multas(ID_Multas, ID_Operativo, Observacion, Latitud, Longitud, ID_Conductor, Nombre_Conductor, ID_Vehiculo, ID_Sincronizar) VALUES(?,?,?,?,?,?,?,?,?)';
    return this.db_Multas.executeSql(sql, [p.ID_Multas, p.ID_Operativo, p.Observacion, p.Latitud, p.Longitud, p.ID_Conductor, p.Nombre_Conductor, p.ID_Vehiculo, p.ID_Sincronizar]);
  }



//@@@@@@@@@@@@@@@@@@@@@@@@@@@    INSERT  Valores    @@@@@@@@@@@@@@@@@@@@@@@@@@@//
Valores(p: any){
  let sql= 'INSERT INTO TB_Valores ( ID_Tipo, N_Incidencia, Proporcion_Minimo, Valor) VALUES (?,?,?,?)';
  return this.db_Multas.executeSql(sql, [p.Tipo, p.REI, p.Prop, p.Valor]);
}

DeleteValore(){
  let sql = 'DELETE FROM TB_Valores';
  return this.db_Multas.executeSql(sql, []);
}

  //@@@@@@@@@@@@@@@@@@@@@@@@@@@    SELECT  TB_MULTAS     @@@@@@@@@@@@@@@@@@@@@@@@@@@//
  Select_Valores(){
    let sql = 'SELECT * FROM TB_Valores';
    return this.db_Multas.executeSql(sql, [])
    .then(response => {
      let Multas = [];
      for (let index = 0; index < response.rows.length; index++) {
        Multas.push( response.rows.item(index) );
      }
      return Promise.resolve( Multas );
    })
    .catch(error => Promise.reject(error));
  }








 //@@@@@@@@@@@@@@@@@@@@@@@@@@@    INSERT  ID_Empleado    @@@@@@@@@@@@@@@@@@@@@@@@@@@//
  ID_Empleado(p){
    let sql = 'INSERT INTO  TB_Empleado ( ID_Empleado) VALUES (?);';
    return this.db_Multas.executeSql(sql, [p]);
  }

 








  //@@@@@@@@@@@@@@@@@@@@@@@@@@@    SELECT  TB_MULTAS     @@@@@@@@@@@@@@@@@@@@@@@@@@@//
  Select_TB_MULTAS(){
    let sql = 'SELECT TB_Multas.ID_Multas,TB_Multas.Nombre_Conductor,TB_Multas.ID_Conductor,TB_Reincidencia.Certificado,TB_Vehiculo.Marca,TB_Vehiculo.Color,TB_Vehiculo.VIN,TB_Vehiculo.Placa,TB_Reincidencia.N_Reincidencia,TB_Reincidencia.ID_Infraccion,TB_Multas.Observacion FROM TB_Multas JOIN TB_Vehiculo ON TB_Multas.ID_Vehiculo=TB_Vehiculo.ID_Vehiculo JOIN TB_Reincidencia ON TB_Multas.ID_Multas=TB_Reincidencia.ID_Multa ORDER BY TB_Multas.ID_Multas DESC';
    return this.db_Multas.executeSql(sql, [])
    .then(response => {
      let Multas = [];
      for (let index = 0; index < response.rows.length; index++) {
        Multas.push( response.rows.item(index) );
      }
      return Promise.resolve( Multas );
    })
    .catch(error => Promise.reject(error));
  }


    //@@@@@@@@@@@@@@@@@@@@@@@@@@@    SELECT  TB_MULTAS UNICO     @@@@@@@@@@@@@@@@@@@@@@@@@@@//
    Select_TB_MULTAS_Ipr(id: any){
      let sql = 'SELECT TB_Multas.ID_Multas,TB_Multas.Nombre_Conductor,TB_Multas.ID_Conductor,TB_Reincidencia.Certificado,TB_Vehiculo.Marca,TB_Vehiculo.Color,TB_Vehiculo.VIN,TB_Vehiculo.Placa,TB_Reincidencia.N_Reincidencia,TB_Reincidencia.ID_Infraccion,TB_Multas.Observacion FROM TB_Multas JOIN TB_Vehiculo ON TB_Multas.ID_Vehiculo=TB_Vehiculo.ID_Vehiculo JOIN TB_Reincidencia ON TB_Multas.ID_Multas=TB_Reincidencia.ID_Multa WHERE TB_Multas.ID_Multas = ?';
      return this.db_Multas.executeSql(sql, [id])
      .then(response => {
        return Promise.resolve( response.rows.item(0) );
      })
      .catch(error => Promise.reject(error));
    }







    //@@@@@@@@@@@@@@@@@@@@@@@@@@@    SELECT  TB_MULTAS UNICO     @@@@@@@@@@@@@@@@@@@@@@@@@@@//
  Select_TB_MULTAS_Unico(){
    let sql = 'SELECT CASE WHEN MAX (ID_Multas) IS NULL THEN 0 ELSE MAX ( ID_Multas)  END total FROM TB_Multas';
    return this.db_Multas.executeSql(sql, [])
    .then(response => {
      return Promise.resolve( response.rows.item(0) );
    })
    .catch(error => Promise.reject(error));
  }













  delete(task: any){
    let sql = 'DELETE FROM TB_Multas WHERE ID_Multas =?';
    return this.db_Multas.executeSql(sql, [task.ID_Multas]);
  }



    //@@@@@@@@@@@@@@@@@@@@@@@@@@@    SELECT  TB_MULTAS UNICO     @@@@@@@@@@@@@@@@@@@@@@@@@@@//
    Valor_Reincidenci(id: any){
      let sql = 'SELECT * FROM TB_Valores WHERE ID_Tipo = ? AND N_Incidencia = ?';
      return this.db_Multas.executeSql(sql, [id.ID_Infraccion, id.N_Reincidencia])
      .then(response => {
        let total = response.rows.item(0).Valor * response.rows.item(0).Proporcion_Minimo;
        return Promise.resolve(total);
      })
      .catch(error => Promise.reject(error));
    }




}
