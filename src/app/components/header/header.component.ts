import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
@Input() titulo: string;
@Input() backButton:string;
@Input() go:string;
  constructor(private route:Router) { }

  ngOnInit() {
    console.log(this.titulo);
  }

  goBack(){
    if (this.go==""){
this.route.navigate(['/']);
    }else{
    
      this.route.navigate([this.go]);
    }
  }

}
