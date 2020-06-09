import { Component, OnInit, NgZone } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { ModalPage } from '../modal/modal.page';
import { BLE } from '@ionic-native/ble/ngx';
import * as aesjs from 'aes-js';
import { ToastController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
@Component({
  selector: 'app-ritmo-cardiaco',
  templateUrl: './ritmo-cardiaco.page.html',
  styleUrls: ['./ritmo-cardiaco.page.scss'],
})
export class RitmoCardiacoPage implements OnInit {
  comenzar = false;
  emparejando = false;
  myband = false;
  device;
  enable = false;
  idDevice;
  ritmocardiacoactual = 0;
  key = new Uint8Array([0x30, 0x31, 0x32, 0x33, 0x34, 0x35, 0x36, 0x37, 0x38, 0x39, 0x40, 0x41, 0x42,
    0x43, 0x44, 0x45]);
  key2;
  buffer;
  parar;
  keymergeada:string="0";
  mybandBD;
  constructor(private auth:AuthService, private toastController: ToastController, public alertController: AlertController, private modalCtrl: ModalController, private ble: BLE, private ngZone: NgZone) { }

  ngOnInit() {
    this.ble.isEnabled().then(data => { this.enable = true; }).catch(() => { this.myband = false; this.enable = false; this.presentAlert(); })
  }

  conectar(){
    this.auth.getMyBand().subscribe(res=>{
      this.mybandBD=res;
      if (this.mybandBD.deviceMyBand!="00"){
        this.ble.connect(this.mybandBD.deviceMyBand).subscribe(
          data => {
            console.log("datos de la pulsera a la que conectas", data);
            console.log("conectado");
            console.log("vinculando....");
            console.log("Realizando la primera escritura...");
          
              console.log("en medio");
            console.log(this.mybandBD.secretKey);
              let valor = this.stringToBytes(this.mybandBD.secretKey);
              console.log(this.bytesToString(valor.buffer));
              console.log("este es el valor",valor);
             
  
              let keyfinal = this.bytesToString(this.key.buffer);
              console.log("key", keyfinal);
  
              this.buffer = this.key.buffer;
              this.key2 = this.bytesToString(this.buffer);
              console.log(this.key2);
  
              this.buffer = this.key.buffer;
              this.key2 = this.bytesToString(this.buffer);
              let textBytes = aesjs.utils.utf8.toBytes(this.key2);
  
  
              let aesEcb = new aesjs.ModeOfOperation.ecb(this.key);
              let bytesencriptados = aesEcb.encrypt(this.key);
              console.log("Bytesencriptados", bytesencriptados);
              let cabecera = new Uint8Array([0x03, 0x08]);
              var mergedArray = new Uint8Array(cabecera.length + bytesencriptados.length);
              mergedArray.set(cabecera);
              mergedArray.set(bytesencriptados, cabecera.length);
             
              console.log("merged", mergedArray);
              this.ble.writeWithoutResponse(this.mybandBD.deviceMyBand, 'fee1', '00000009-0000-3512-2118-0009af100700', mergedArray.buffer);
  
  
            
        
            this.ble.startNotification(this.mybandBD.deviceMyBand, 'fee1', '00000009-0000-3512-2118-0009af100700').subscribe(buffer => {
              console.log("continua");
              let data = new Uint8Array(buffer);
              if (data[1] == 0x03) {
                console.log("ha finalizado");
                this.ngZone.run(() => {
                  this.enable = true;
                  this.emparejando = true;
                  this.idDevice = this.mybandBD.deviceMyBand;
                  this.myband = true;
                });
    
                this.presentToast("<img src='../../../assets/ok.png' alt='Pulsera' width='32' height='32'> &nbsp; MyBand emparejada con éxito");
                this.ble.stopNotification(this.mybandBD.deviceMyBand, 'fee1', '00000009-0000-3512-2118-0009af100700').then(data => console.log("Se han apagado las notificaciones con éxito", data)).catch(err => console.log("Error en la desactivación de notificaciones", err));
              }

              





            });
          });

      }
    },
      err=>{console.log("error al intentar leer datos de la my band de bd")});
  }
  bluetoothConnect() {
    this.ble.enable().then(
      data => {
        console.log("bluetooth activado")
        this.enable = true;
      }
    ).catch(
      data => {
        console.log("error conectado el bluetooth", data);
        this.myband = false
        this.enable = false;
      });

  }
  async presentToast(mensaje) {
    const toast = await this.toastController.create({
      message: mensaje,
      position: 'top',
      animated: true,
      cssClass: "my-custom-class",
      translucent: true,
      duration: 5000

    });
    toast.present();
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Bluetooth desconectado ',
      message: 'El bluetooth no está desconectado, si no lo conectas no es posible la utilizar esta función, quieres conectarlo?',
      buttons: [{
        text: 'cancel',
        role: 'cancel',
        handler: blah => {
          console.log('Confirm Cancel: blah');
          this.myband = false;
          this.enable = false;
        }
      }, {
        text: 'aceptar',
        handler: blah => {
          console.log('Activando bluetoothh .....');
          this.ble.enable().then(
            data => {
              console.log("bluetooth activado")
              this.enable = true;
            }
          ).catch(
            data => {
              console.log("error conectado el bluetooth", data);
              this.myband = false
              this.enable = false;
            });
        }
      }

      ]
    });

    await alert.present();
  }

  async openModal() {
    this.ble.isEnabled().then(data => { this.enable = true; }).catch(() => { this.enable = false; this.myband = false; this.emparejando = false; })

    const modal = await this.modalCtrl.create({
      component: ModalPage
    });
    modal.onDidDismiss()
      .then((data) => {
        const user = data['data'];
        this.device = user; // Here's your selected user!
        if (typeof this.device === 'undefined') {
          this.myband = false;
          this.emparejando = false;
        } else { this.deviceSelected(this.device); }

        console.log("este es el valor del dispositivo", this.device);


      });
    return await modal.present();

  }

  leerRit() {

    if (this.comenzar) {
      this.leerRitmoCardiaco();
      this.parar = setInterval(() => {
        this.leerRitmoCardiaco();
      }, 10000);

    } else {

      clearInterval(this.parar);

    }

  }

  leerRitmoCardiaco() {

    if (this.comenzar) {
      let medirPulso = new Uint8Array([0x15, 0x02, 0x01]).buffer;

      this.ble.write(this.idDevice, "180d", "2a39", medirPulso).then(data => console.log(data)).catch(err => console.log(err));

      this.ble.startNotification(this.idDevice, "180d", "2a37").subscribe(
        data => {
          console.log("control", data);
          let dato = new Uint8Array(data);
          this.ngZone.run(() => {
            this.ritmocardiacoactual = dato[1];
          });

          console.log("data 2", this.ritmocardiacoactual);
          this.ble.stopNotification(this.idDevice, "180d", "2a37").then(data => console.log("Se han apagado las notificaciones cardiacas con éxito", data)).catch(err => console.log("Error en la desactivación de notificaciones", err));

        },
        (err) => console.log('Unexpected Error Failed to subscribe for button state changes', err)
      );
    }
  }

  deviceSelected(device) {
    this.ble.isEnabled().then(data => { this.enable = true; }).catch(() => { this.myband = false; this.enable = false; this.emparejando = false; })

    this.myband = true;
    console.log(JSON.stringify(device) + ' selected');
    let value = 1234;

    let buffer = new Uint8Array([0x01, 0x08, 0x30, 0x31, 0x32, 0x33, 0x34, 0x35, 0x36, 0x37, 0x38, 0x39, 0x40, 0x41, 0x42,
      0x43, 0x44, 0x45]).buffer

    this.ble.connect(device.id).subscribe(
      data => {
        console.log("datos de la pulsera a la que conectas", data);
        console.log("conectado");
        console.log("vinculando....");
        console.log("Realizando la primera escritura...");

        // this.ble.write(device.id,'fee1', '00000009-0000-3512-2118-0009af100700', data.buffer).then(d=>{}).catch(err=>console.log(err));
        this.ble.writeWithoutResponse(device.id, 'fee1', '00000009-0000-3512-2118-0009af100700', buffer);

        this.ble.startNotification(device.id, 'fee1', '00000009-0000-3512-2118-0009af100700').subscribe(buffer => {
          console.log("ha habido cambios! se ha recibido lo siguiente:");
          let data = new Uint8Array(buffer);

          console.log(data);
          if (data[1] == 0x01) {
            console.log("al principio");
            let buffer1 = new Uint8Array([0x02, 0x08]).buffer;
            this.ble.writeWithoutResponse(device.id, 'fee1', '00000009-0000-3512-2118-0009af100700', buffer1);

          }
          if (data[1] == 0x03) {
            console.log("ha finalizado");
            this.ngZone.run(() => {
              this.enable = true;
              this.emparejando = true;
              this.idDevice = device.id;
              this.myband = true;
            });

            this.presentToast("<img src='../../../assets/ok.png' alt='Pulsera' width='32' height='32'> &nbsp; MyBand emparejada con éxito");
            this.ble.stopNotification(device.id, 'fee1', '00000009-0000-3512-2118-0009af100700').then(data => console.log("Se han apagado las notificaciones con éxito", data)).catch(err => console.log("Error en la desactivación de notificaciones", err));
            this.auth.mybandBD(device.id,this.keymergeada).subscribe((res)=>{console.log(res)},(err)=>{console.log(err)});
          }
          if (data[1] = 0x02) {
            console.log("en medio");

            let valor = this.bytesToString(data.slice(3, 19).buffer);
            console.log("slice", data.slice(3, 19));
            console.log("este es el valor",valor);
            console.log(valor);

            let keyfinal = this.bytesToString(this.key.buffer);
            console.log("key", keyfinal);

            this.buffer = this.key.buffer;
            this.key2 = this.bytesToString(this.buffer);
            console.log(this.key2);

            this.buffer = this.key.buffer;
            this.key2 = this.bytesToString(this.buffer);
            let textBytes = aesjs.utils.utf8.toBytes(this.key2);


            let aesEcb = new aesjs.ModeOfOperation.ecb(this.key);
            let bytesencriptados = aesEcb.encrypt(data.slice(3, 19));
            console.log("Bytesencriptados", bytesencriptados);
            let cabecera = new Uint8Array([0x03, 0x08]);
            var mergedArray = new Uint8Array(cabecera.length + bytesencriptados.length);
            mergedArray.set(cabecera);
            mergedArray.set(bytesencriptados, cabecera.length);
            if (this.keymergeada=="0" && valor!=""){
              this.ngZone.run(() => {
              this.keymergeada=valor;
              });
              console.log("MERGEADO GUARDADOO", this.keymergeada);
            }
            console.log("merged", mergedArray);
            this.ble.writeWithoutResponse(device.id, 'fee1', '00000009-0000-3512-2118-0009af100700', mergedArray.buffer);


          }
        }, err => {
          console.log("no notificacion", err); this.emparejando = false;
          this.myband = false;
        });
      }, err => {
        console.log("Errrir¡¡¡ a conectar", err);
        this.ngZone.run(() => {
          this.emparejando = false;
          this.myband = false;
          this.presentToast("<img src='../../../assets/x.png' alt='Pulsera' width='32' height='32'>&nbsp;No se ha podido emparejar con la pulsera");
        });
      }

    );

  }


  stringToBytes(string) {
    var array = new Uint8Array(string.length);
    for (var i = 0, l = string.length; i < l; i++) {
      array[i] = string.charCodeAt(i);
    }
    return array;
  }

  bytesToString(buffer) {
    return String.fromCharCode.apply(null, new Uint8Array(this.buffer));
  }

  ionViewWillLeave() {
    console.log("desconectando");
    this.ble.disconnect(
      this.idDevice
    ).then(
      () => {
        console.log("desconectado correctamente");
        this.emparejando = false;
        this.myband = false;
      },
      () => { console.log("desconectado erroneamente") }
    );
  }

}
