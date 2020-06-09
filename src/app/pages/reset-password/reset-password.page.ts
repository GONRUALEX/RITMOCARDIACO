import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage implements OnInit {
  credentialsForm: FormGroup;
  constructor(private formBuilder: FormBuilder,  private route:Router,  private authService: AuthService) { }

  ngOnInit() {
    this.credentialsForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    this.authService.resetPassword(this.credentialsForm.value).subscribe(()=>{
      this.route.navigate(['login']);
    },
    (err)=>{
      console.log("Error en el login");
      this.route.navigate(['login']);
    });
  }
  goLogin(){
    this.route.navigate(['login']);
  }

}
