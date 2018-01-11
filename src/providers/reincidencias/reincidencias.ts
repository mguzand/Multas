import { Injectable } from '@angular/core';

import { SQLiteObject } from '@ionic-native/sqlite';
import { LocalStorage } from '../../service/storage.service';





@Injectable()
export class ReincidenciasProvider {
private db_Multas: SQLiteObject = null;

constructor(private SerCtrl: LocalStorage) {}

  setDatabase(db: SQLiteObject){
    if(this.db_Multas === null){
      this.db_Multas = db;
    }
  }


  SelectReincidencia(Placa: any){
    let sql = 'SELECT CASE WHEN SUM(CASE WHEN ID_Estado=1 AND ID_Infraccion=3 THEN 1 ELSE 0 END) IS NULL THEN 0 ELSE SUM(CASE WHEN ID_Estado=1 AND ID_Infraccion=3 THEN 1 ELSE 0 END) END AS LEVES,CASE WHEN SUM(CASE WHEN ID_Estado=1 AND ID_Infraccion=2 THEN 1 ELSE 0 END) IS NULL THEN 0 ELSE SUM(CASE WHEN ID_Estado=1 AND ID_Infraccion=2 THEN 1 ELSE 0 END) END AS GRAVES,CASE WHEN SUM(CASE WHEN ID_Estado=1 AND ID_Infraccion=1 THEN 1 ELSE 0 END) IS NULL THEN 0 ELSE SUM(CASE WHEN ID_Estado=1 AND ID_Infraccion=1 THEN 1 ELSE 0 END) END AS MGRAVES FROM TB_Reincidencia WHERE (Placa= ? )';
    return this.db_Multas.executeSql(sql, [Placa])
    .then(result=>{
       return Promise.resolve( result.rows.item(0) );
    })
    .catch(error => Promise.reject(error));
  }
//REC
  
InsertInfraccion(Data: any){

  //@@@@@@@@@@@@@  INICIO  PARA INFRACCIONES LEVES   @@@@@@@@@@@@@//
  if(Data.ID_Infraccion == 3){

    var leves = Data.leves + 1;
    if(leves==3){ //VALIDACION LEVES INICIO
      let sql = 'UPDATE  TB_Reincidencia SET ID_Estado = ? WHERE ID_Infraccion = ? AND (Placa = ? OR Certificado = ?)';
      return this.db_Multas.executeSql(sql, [2, 3, Data.Placa, Data.Certificado]).then(result=>{

        var graves = Data.graves + 1;
        if(graves==3){//VALIDACION GRAVES INICIO
          let sql2 = 'UPDATE  TB_Reincidencia SET ID_Estado = ? WHERE ID_Infraccion = ? AND (Placa = ? OR Certificado = ?)';
          return this.db_Multas.executeSql(sql2, [2,2, Data.Placa, Data.Certificado]).then(result=>{

            var mgraves = Data.mgraves + 1;
            if(mgraves==3){ //VALIDACION MGRAVES INICIO
              let sql3 = "INSERT INTO TB_Reincidencia (ID_Reincidencia, Placa, Vin, Certificado, ID_Multa, ID_Infraccion, N_Reincidencia, ID_Estado, ID_Sub_Reincidencia, ID_Sincronizar, User) VALUES ((SELECT CASE WHEN A IS NULL THEN ('REI-' || (SELECT * FROM TB_Empleado) || '-1'  ) ELSE A END FROM (SELECT 'REI-' || ID_Empleado || '-' || (COUNT(*)+1) AS A,ID_Empleado  FROM TB_Reincidencia,TB_Empleado)), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);";
              return this.db_Multas.executeSql(sql3, [Data.Placa, Data.Vin, Data.Certificado, Data.ID_Multa,1,1,1,Data.ID_Sub_Reincidencia,1,Data.User]).then(result=>{
                
                let sql2 = 'UPDATE  TB_Reincidencia SET ID_Estado = ? WHERE ID_Infraccion = ? AND (Placa = ? OR Certificado = ?)';
                return this.db_Multas.executeSql(sql2, [2,3, Data.Placa, Data.Certificado])
              })
            }else{
              let sql1 = "INSERT INTO TB_Reincidencia (ID_Reincidencia, Placa, Vin, Certificado, ID_Multa, ID_Infraccion, N_Reincidencia, ID_Estado, ID_Sub_Reincidencia, ID_Sincronizar, User) VALUES ((SELECT CASE WHEN A IS NULL THEN ('REI-' || (SELECT * FROM TB_Empleado) || '-1'  ) ELSE A END FROM (SELECT 'REI-' || ID_Empleado || '-' || (COUNT(*)+1) AS A,ID_Empleado  FROM TB_Reincidencia,TB_Empleado)), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);";
              return this.db_Multas.executeSql(sql1, [ Data.Placa, Data.Vin, Data.Certificado, Data.ID_Multa,3,1,1,Data.ID_Sub_Reincidencia,1,Data.User]);
            }
            //VALIDACION MGRAVES FIN
          })
        }else{
          let sql1 = "INSERT INTO TB_Reincidencia (ID_Reincidencia, Placa, Vin, Certificado, ID_Multa, ID_Infraccion, N_Reincidencia, ID_Estado, ID_Sub_Reincidencia, ID_Sincronizar, User) VALUES ((SELECT CASE WHEN A IS NULL THEN ('REI-' || (SELECT * FROM TB_Empleado) || '-1'  ) ELSE A END FROM (SELECT 'REI-' || ID_Empleado || '-' || (COUNT(*)+1) AS A,ID_Empleado  FROM TB_Reincidencia,TB_Empleado)), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);";
          return this.db_Multas.executeSql(sql1, [Data.Placa, Data.Vin, Data.Certificado, Data.ID_Multa,2,1,1,Data.ID_Sub_Reincidencia,1,Data.User]);
        }
        //VALIDACION GRAVES FIN
      })
    }else{
      let sql1 = "INSERT INTO TB_Reincidencia (ID_Reincidencia, Placa, Vin, Certificado, ID_Multa, ID_Infraccion, N_Reincidencia, ID_Estado, ID_Sub_Reincidencia, ID_Sincronizar, User) VALUES ((SELECT CASE WHEN A IS NULL THEN ('REI-' || (SELECT * FROM TB_Empleado) || '-1'  ) ELSE A END FROM (SELECT 'REI-' || ID_Empleado || '-' || (COUNT(*)+1) AS A,ID_Empleado  FROM TB_Reincidencia,TB_Empleado)), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);";
      return this.db_Multas.executeSql(sql1, [Data.Placa, Data.Vin, Data.Certificado, Data.ID_Multa,3,leves,1,Data.ID_Sub_Reincidencia,1,Data.User]);
    }
    //VALIDACION LEVES FIN
  }
  //@@@@@@@@@@@@@  FIN  PARA INFRACCIONES LEVES   @@@@@@@@@@@@@//

  //@@@@@@@@@@@@@  INICIO  PARA INFRACCIONES GRAVES   @@@@@@@@@@@@@//
  else if(Data.ID_Infraccion == 2) {
    var graves = Data.graves + 1;
        if(graves==3){//VALIDACION GRAVES INICIO
          let sql2 = 'UPDATE  TB_Reincidencia SET ID_Estado = ? WHERE ID_Infraccion = ? AND (Placa = ? OR Certificado = ?)';
          return this.db_Multas.executeSql(sql2, [2,2, Data.Placa, Data.Certificado]).then(result=>{

            var mgraves = Data.mgraves + 1;
            if(mgraves==3){ //VALIDACION MGRAVES INICIO
              let sql3 = "INSERT INTO TB_Reincidencia (ID_Reincidencia, Placa, Vin, Certificado, ID_Multa, ID_Infraccion, N_Reincidencia, ID_Estado, ID_Sub_Reincidencia, ID_Sincronizar, User) VALUES ((SELECT CASE WHEN A IS NULL THEN ('REI-' || (SELECT * FROM TB_Empleado) || '-1'  ) ELSE A END FROM (SELECT 'REI-' || ID_Empleado || '-' || (COUNT(*)+1) AS A,ID_Empleado  FROM TB_Reincidencia,TB_Empleado)), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);";
              return this.db_Multas.executeSql(sql3, [Data.Placa, Data.Vin, Data.Certificado, Data.ID_Multa,1,1,1,Data.ID_Sub_Reincidencia,1,Data.User]).then(result=>{
                
                let sql2 = 'UPDATE  TB_Reincidencia SET ID_Estado = ? WHERE ID_Infraccion = ? AND (Placa = ? OR Certificado = ?)';
                return this.db_Multas.executeSql(sql2, [2,3, Data.Placa, Data.Certificado])
              })
            }else{
              let sql1 = "INSERT INTO TB_Reincidencia (ID_Reincidencia, Placa, Vin, Certificado, ID_Multa, ID_Infraccion, N_Reincidencia, ID_Estado, ID_Sub_Reincidencia, ID_Sincronizar, User) VALUES ((SELECT CASE WHEN A IS NULL THEN ('REI-' || (SELECT * FROM TB_Empleado) || '-1'  ) ELSE A END FROM (SELECT 'REI-' || ID_Empleado || '-' || (COUNT(*)+1) AS A,ID_Empleado  FROM TB_Reincidencia,TB_Empleado)), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);";
              return this.db_Multas.executeSql(sql1, [ Data.Placa, Data.Vin, Data.Certificado, Data.ID_Multa,3,1,1,Data.ID_Sub_Reincidencia,1,Data.User]);
            }
            //VALIDACION MGRAVES FIN
          })
        }else{
          let sql1 = "INSERT INTO TB_Reincidencia (ID_Reincidencia, Placa, Vin, Certificado, ID_Multa, ID_Infraccion, N_Reincidencia, ID_Estado, ID_Sub_Reincidencia, ID_Sincronizar, User) VALUES ((SELECT CASE WHEN A IS NULL THEN ('REI-' || (SELECT * FROM TB_Empleado) || '-1'  ) ELSE A END FROM (SELECT 'REI-' || ID_Empleado || '-' || (COUNT(*)+1) AS A,ID_Empleado  FROM TB_Reincidencia,TB_Empleado)), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);";
          return this.db_Multas.executeSql(sql1, [Data.Placa, Data.Vin, Data.Certificado, Data.ID_Multa,2,graves,1,Data.ID_Sub_Reincidencia,1,Data.User]);
        }
        //VALIDACION GRAVES FIN
  }
  //@@@@@@@@@@@@@  FIN  PARA INFRACCIONES GRAVES   @@@@@@@@@@@@@//

  //@@@@@@@@@@@@@  INICIO  PARA INFRACCIONES MUY GRAVES   @@@@@@@@@@@@@//
  else if(Data.ID_Infraccion == 1) {
    var mgraves = Data.mgraves + 1;
    if(mgraves==3){ //VALIDACION MGRAVES INICIO
      let sql3 = "INSERT INTO TB_Reincidencia (ID_Reincidencia, Placa, Vin, Certificado, ID_Multa, ID_Infraccion, N_Reincidencia, ID_Estado, ID_Sub_Reincidencia, ID_Sincronizar, User) VALUES ((SELECT CASE WHEN A IS NULL THEN ('REI-' || (SELECT * FROM TB_Empleado) || '-1'  ) ELSE A END FROM (SELECT 'REI-' || ID_Empleado || '-' || (COUNT(*)+1) AS A,ID_Empleado  FROM TB_Reincidencia,TB_Empleado)), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);";
      return this.db_Multas.executeSql(sql3, [Data.Placa, Data.Vin, Data.Certificado, Data.ID_Multa,1,1,1,Data.ID_Sub_Reincidencia,1,Data.User]).then(result=>{
        
        let sql2 = 'UPDATE  TB_Reincidencia SET ID_Estado = ? WHERE ID_Infraccion = ? AND (Placa = ? OR Certificado = ?)';
        return this.db_Multas.executeSql(sql2, [2,3, Data.Placa, Data.Certificado])
      })
    }else{
      let sql1 = "INSERT INTO TB_Reincidencia (ID_Reincidencia, Placa, Vin, Certificado, ID_Multa, ID_Infraccion, N_Reincidencia, ID_Estado, ID_Sub_Reincidencia, ID_Sincronizar, User) VALUES ((SELECT CASE WHEN A IS NULL THEN ('REI-' || (SELECT * FROM TB_Empleado) || '-1'  ) ELSE A END FROM (SELECT 'REI-' || ID_Empleado || '-' || (COUNT(*)+1) AS A,ID_Empleado  FROM TB_Reincidencia,TB_Empleado)), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);";
      return this.db_Multas.executeSql(sql1, [ Data.Placa, Data.Vin, Data.Certificado, Data.ID_Multa,3,mgraves,1,Data.ID_Sub_Reincidencia,1,Data.User]);
    }
    //VALIDACION MGRAVES FIN
  }
  //@@@@@@@@@@@@@  FIN  PARA INFRACCIONES GRAVES   @@@@@@@@@@@@@//

}






SelectAll(){

  let sql = 'SELECT * FROM TB_Reincidencia';
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



}
