import { Component, OnInit, NgZone } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ToastController } from '@ionic/angular';
import { BLE } from '@ionic-native/ble/ngx';
import { AES256 } from '@ionic-native/aes-256/ngx';
import { Observable } from 'rxjs';
//import * as CryptoJS from 'crypto-js';
import * as aesjs from 'aes-js';
//import * as AES from 'crypto-js/aes';
//import * as Cipher from 'aes-ecb';
import { AlertController } from '@ionic/angular';
import * as concat from 'arraybuffer-concat';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  devices:any[]=[];
  peripheral;
  ritmo=0;
  id="";
  buttonState=0;
  conectado;
  idDevice="0";
  key = new Uint8Array([0x30, 0x31, 0x32, 0x33, 0x34, 0x35, 0x36, 0x37, 0x38, 0x39, 0x40, 0x41, 0x42,
0x43, 0x44, 0x45]);
  key2;
  buffer;
  constructor(public alertController: AlertController, private ngZone:NgZone, private aes256: AES256, private ble:BLE, private toastController:ToastController, private authService: AuthService) { }

  ngOnInit() {
  //this.ble.isEnabled().then(data=>{}).catch(()=>{this.presentAlert()})
  
    //console.log(Cipher.encrypt(this.key2, "Secret Passphrase"));

  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header:'e ' ,
      subHeader: 'Subtitle',
      message: 'This is an alert message.',
      buttons: ['OK']
    });

    await alert.present();
  }


  ver(){
  this.buffer=this.key.buffer;
   this.key2=this.bytesToString(this.buffer);
  

      let medirPulso = new Uint8Array([0x15, 0x02, 0x01]).buffer;
      
    this.ble.write(this.idDevice,"180d","2a39",medirPulso).then(data=>console.log(data)).catch(err=>console.log(err));

   this.ble.startNotification(this.idDevice,"180d","2a37").subscribe(
      data => {
      console.log("ha entrado");
      console.log("control",data);
      this.ble.stopNotification(this.idDevice,"180d","2a37").then(data=>console.log("Se han apagado las notificaciones cardiacas con éxito",data)).catch(err=>console.log("Error en la desactivación de notificaciones",err));
                 
     },
      (err) => console.log('Unexpected Error Failed to subscribe for button state changes',err)
      );

/*
   this.ble.read(this.idDevice,"fee0","00000006-0000-3512-2118-0009af100700").
                then(
                (data)=>{
                    let dataf=new Uint8Array(data);
                    console.log("data:", dataf);
                }
                ).catch(
                (err)=>{
                    console.log(err);
                }
                );

                this.ble.read(this.idDevice,"fee0","00000007-0000-3512-2118-0009af100700").
                then(
                (data)=>{
                    let dataf=new Uint8Array(data);
                    console.log("data:", dataf);
                }
                ).catch(
                (err)=>{
                    console.log(err);
                }
                );
   /*
   console.log(this.key2);
   (window as any).global = window;
                    // @ts-ignore
                     window.Buffer = window.Buffer || require('buffer').Buffer;
   console.log(Cipher.encrypt(this.key2, "Secret Passphrase"));*/
  
  }
   bytesToString(buffer) {
      return String.fromCharCode.apply(null, new Uint8Array(this.buffer));
  }
  logout() {
    this.authService.logout();
    let toast = this.toastController.create({
      message: 'logout con éxito',
      duration: 3000
    });
    toast.then(toast => toast.present());
  }

  scan(){
    this.devices=[]; 
    this.ble.scan([],5).subscribe(
        device=>this.onDeviceDiscovered(device),
        error=>console.log("Error en el scaneo")
    );
  }

  onDeviceDiscovered(device){
    console.log('Discovered'+JSON.stringify(device, null, 2));
    this.ngZone.run(()=>{
      this.devices.push(device);
      console.log(device);
    });
  }

 

  deviceSelected(device){
    console.log(JSON.stringify(device) + ' selected');
    let value = 1234;
   // let buffer = new ArrayBuffer(18);
    /*var auint=new Uint8Array(18);
    auint[0]=0x01;
    auint[1]=0x08;
    auint[2]=0x30;
    auint[3]=0x31;
    auint[4]=0x32;
    auint[5]=0x33;
    auint[6]=0x34;
    auint[7]=0x35;
    auint[8]=0x36;
    auint[9]=0x37;
    auint[10]=0x38;
    auint[11]=0x39;
    auint[12]=0x40;
    auint[13]=0x41;
    auint[14]=0x42;
    auint[15]=0x43;
    auint[16]=0x44;
    auint[17]=0x45;*/
    let buffer = new Uint8Array([0x01, 0x08, 0x30, 0x31, 0x32, 0x33, 0x34, 0x35, 0x36, 0x37, 0x38, 0x39, 0x40, 0x41, 0x42,
0x43, 0x44, 0x45]).buffer

    this.ble.connect(device.id).subscribe(
        data => {
            console.log("datos de la pulsera a la que conectas",data);
            console.log("conectado");
            this.conectado=true;
            console.log("vinculando....");
            console.log("Realizando la primera escritura...");
           
           // this.ble.write(device.id,'fee1', '00000009-0000-3512-2118-0009af100700', data.buffer).then(d=>{}).catch(err=>console.log(err));
             this.ble.writeWithoutResponse(device.id,'fee1','00000009-0000-3512-2118-0009af100700', buffer);
        
            this.ble.startNotification(device.id,'fee1','00000009-0000-3512-2118-0009af100700').subscribe(buffer=>{
                console.log("ha habido cambios! se ha recibido lo siguiente:");
                let data= new Uint8Array(buffer);
                
                console.log(data);
                if (data[1]==0x01){
                    console.log("al principio");
                    let buffer1=new Uint8Array([0x02, 0x08]).buffer;
                    this.ble.writeWithoutResponse(device.id,'fee1','00000009-0000-3512-2118-0009af100700', buffer1);
        
                }
               if (data[1]==0x03){
                    console.log("ha finalizado");
                    this.idDevice=device.id;
                    this.ble.stopNotification(device.id,'fee1','00000009-0000-3512-2118-0009af100700').then(data=>console.log("Se han apagado las notificaciones con éxito",data)).catch(err=>console.log("Error en la desactivación de notificaciones",err));
                   /* let datos = new Uint8Array(3);
                    datos[0]=0x15;
                    datos[1]=0x02;
                    datos[2]=0x01;
                    this.ble.write(device.id,'180d','2a39',datos.buffer).then(buffer=>{
                        console.log("pidiendo hr....");
                        console.log("esto devuelve",buffer);
                    
                    },
                    error=>{
                        console.log("error->",error);
                    });*/
                }
                if(data[1]=0x02){
                    console.log("en medio");
                   let valor = this.bytesToString(data.slice(3,19).buffer);
                   console.log("slice",data.slice(3,19));
                   
                   console.log(valor);
                  
                  let keyfinal=this.bytesToString(this.key.buffer);
                  console.log("key",keyfinal);

               /*   this.buffer=this.key.buffer;
   this.key2=this.bytesToString(this.buffer);
   console.log("clave2",this.key2);
   (window as any).global = window;
                    // @ts-ignore
                     window.Buffer = window.Buffer || require('buffer').Buffer;
 let res = Cipher.encrypt(this.key2,valor);
 console.log("encriptado",res);
        let bytesencriptados=this.stringToBytes(res);
                    console.log("Bytesencriptados",bytesencriptados);
                    let cabecera = new Uint8Array([0x03, 0x08]);
                    var mergedArray = concat(cabecera, bytesencriptados);
                   let bufferfinal= new Uint8Array(mergedArray).buffer;
                   console.log("bufferfinal",bufferfinal);
                    console.log("merged", mergedArray);         
                  this.ble.writeWithoutResponse(device.id,'fee1','00000009-0000-3512-2118-0009af100700', bufferfinal);*/

                    this.buffer=this.key.buffer;
   this.key2=this.bytesToString(this.buffer);
   console.log(this.key2);
  
  this.buffer=this.key.buffer;
   this.key2=this.bytesToString(this.buffer);
   let textBytes = aesjs.utils.utf8.toBytes(this.key2);
  

   let aesEcb = new aesjs.ModeOfOperation.ecb(this.key);
let bytesencriptados = aesEcb.encrypt(data.slice(3,19));
   console.log("Bytesencriptados",bytesencriptados);
                    let cabecera = new Uint8Array([0x03, 0x08]);
                    var mergedArray = new Uint8Array(cabecera.length + bytesencriptados.length);
                    mergedArray.set(cabecera);
                    mergedArray.set(bytesencriptados, cabecera.length);
                    console.log("merged", mergedArray);         
                  this.ble.writeWithoutResponse(device.id,'fee1','00000009-0000-3512-2118-0009af100700', mergedArray.buffer);



                  /* var aesEcb =new aesjs.ModeOfOperation.ecb(aesjs.utils.utf16.toBytes(keyfinal));
                   var encryptedBytes = aesEcb.encrypt(data.slice(2,19));

                   console.log("texto ecnfriptadoooooooooooooooooooooo",encryptedBytes);

                    console.log("Escribo la data como queda quitando los 2 primeros");
                 /*  this.aes256.encrypt(keyfinal, keyfinal,valor)
                    .then(res => {
                    console.log('Encrypted Data: ',res);
                    let bytesencriptados=this.stringToBytes(res);
                    console.log("Bytesencriptados",bytesencriptados);
                    let cabecera = new Uint8Array([0x03, 0x08]);
                    var mergedArray = new Uint8Array(cabecera.length + bytesencriptados.length);
                    mergedArray.set(cabecera);
                    mergedArray.set(bytesencriptados, cabecera.length);
                    console.log("merged", mergedArray);
                   /*  let cabecera = new Uint8Array([0x03, 0x08, this.stringToBytes(res)]);
                     //let respuesta= cabecera.concat(this.stringToBytes(res));
                     console.log("valor en byttes",respuesta);
                     this.ble.writeWithoutResponse(device.id,'fee1','00000009-0000-3512-2118-0009af100700', mergedArray.buffer);
                    })
                    .catch((error: any) => console.error("problema al encriptar",error));*/

                   /* var res = AES.encrypt(valor, keyfinal);
                 
                 console.log('Encrypted Data: ',res);
                    let bytesencriptados=this.stringToBytes(res);
                    console.log("Bytesencriptados",bytesencriptados);
                    let cabecera = new Uint8Array([0x03, 0x08]);
                    var mergedArray = new Uint8Array(cabecera.length + bytesencriptados.length);
                    mergedArray.set(cabecera);
                    mergedArray.set(bytesencriptados, cabecera.length);
                    console.log("merged", mergedArray);
                   /*  let cabecera = new Uint8Array([0x03, 0x08, this.stringToBytes(res)]);
                     //let respuesta= cabecera.concat(this.stringToBytes(res));
                     console.log("valor en byttes",respuesta);*/
                   //  this.ble.writeWithoutResponse(device.id,'fee1','00000009-0000-3512-2118-0009af100700', mergedArray.buffer);
       
                }
           },err=>console.log("no notificacion",err) );
        },err=>console.log("Errrir¡¡¡ a conectar", err)

    );







   /* this.ble.connect(device.id).subscribe(
        peripheral=>{ this.onConnected(peripheral); 
        console.log("conectado al dispositivo");},
        error=>{ console.log("error al conectarse", error)}
    );*/
  } 

  stringToBytes(string) {
     var array = new Uint8Array(string.length);
     for (var i = 0, l = string.length; i < l; i++) {
         array[i] = string.charCodeAt(i);
      }
      return array;
  }


  readDataNotice(deviceId: string, serviceUUID: string, characteristicUUID: string): Observable<any> {
        return this.ble.startNotification(deviceId, serviceUUID, characteristicUUID);
 }



  onConnected(peripheral){
    
        this.peripheral=peripheral;
      



      /*  console.log(peripheral);//2902,2a37,180d
    this.ble.startNotification(this.peripheral.id,"180d","2a37").subscribe(
      data => {
      console.log("ha entrado");
      this.onButtonStateChange(data);},
      (err) => console.log('Unexpected Error Failed to subscribe for button state changes',err
      )
    )*/

  }

   onButtonStateChange(buffer:ArrayBuffer) {
    var data = new Uint8Array(buffer);
    

    this.ngZone.run(() => {
    console.log(data[0]);
      this.buttonState = data[0];
    });

  }


  subscribe( BLE_SERVICE,BLE_CHARACTERISTIC) {

        this.ble
            .startNotification(this.peripheral.id,
 BLE_SERVICE, BLE_CHARACTERISTIC)
            .subscribe(
                data => {
                    console.log("aqui esta lo que devuelve",data);
                    this.onValueChange(data);
                },
                (err) =>console.log("error como siempre al notificar",err)
            );
    }

onValueChange(buffer: ArrayBuffer) {
        this.ngZone.run(() => {
            try {
               
console.log("resultado", this.bytesToString(buffer).replace(/\s+/g, " "));
               

//Simply assign data to variable dataFromDevice and string concat
            } catch (e) {
                console.log(e);
            }
        });
    }

  

  
  BleWrite( BLE_SERVICE,BLE_CHARACTERISTIC) {

        // Subscribe for notifications when the resitance changes
        var inputdata = new Uint8Array(5);
        inputdata[0] = 0x0001; 

        this.ble
            .writeWithoutResponse(
                this.peripheral.id,
                BLE_SERVICE,
                BLE_CHARACTERISTIC,
                inputdata.buffer
            )
            .then(
                data => {
                 
                    
                    console.log("esto se ha escrito",data);
                  
                },
                err => {
                    console.log(err);
                }
            );
    }

  onbuttonstate(buffer: ArrayBuffer){
    console.log(buffer);
    var data = new Uint8Array(buffer);
    console.log("eentra en funcion lectura");
    this.ngZone.run(
        ()=>{
            this.ritmo=data[0];
            console.log("ritmo cardiaco es :",data[0]);
        }
    );
  }

  ionViewWillLeave(){
    console.log("desconectando");
    this.ble.disconnect(
        this.peripheral.id
    ).then(
        ()=>{console.log("desconectado correctamente")},
        ()=>{console.log("desconectado erroneamente")}
    );
  }

  

}





