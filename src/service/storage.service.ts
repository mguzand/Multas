import {Injectable} from '@angular/core';



@Injectable()

export class  LocalStorage {

constructor(){

}

	// getlocation(){
	//   return this.geolocation.getCurrentPosition();
	// }

getKey(Key) : string{
		return localStorage.getItem(Key);
	}

	getUserInfo(){
		return 'manuel guzman';
	}	

}