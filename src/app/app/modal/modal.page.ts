import { Component, OnInit, NgZone } from '@angular/core';
import { BLE } from '@ionic-native/ble/ngx';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.page.html',
  styleUrls: ['./modal.page.scss'],
})
export class ModalPage implements OnInit {
  devices:any[]=[];
  constructor( private ble:BLE,private ngZone:NgZone,private modalCtrl:ModalController) { 
   this.scan();
  }

  ngOnInit() {

  }

  close(){
    this.modalCtrl.dismiss();
    
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
    this.modalCtrl.dismiss(device);
  }

}
