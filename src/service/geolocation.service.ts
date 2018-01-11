import {Injectable} from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation';


@Injectable()

export class  Geolocationservice {

constructor(private geolocation: Geolocation){

}

	getlocation(){
	  return this.geolocation.getCurrentPosition();
	}


	
}