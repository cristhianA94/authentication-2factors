import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';


import { AuthService } from "../../shared/services/auth.service";


@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})

export class SignInComponent implements OnInit {


  constructor(
    public authService: AuthService,
    private formbuild: FormBuilder,
  ) { }

  loginForm: FormGroup;
  userAuth = [];

  ngOnInit(
  ) {
    this.buildForm();
  }

  /* Validador de formulario */
  buildForm(): void {
    this.loginForm = this.formbuild.group({
      correo: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      pass: ['', Validators.required,
        //Validators.minLength(6), Validators.pattern(/^(?=\D*\d)(?=[^a-z]*[a-z])(?=[^A-Z]*[A-Z]).{8,30}$/)
      ]
    });
  }

  login() {
    this.authService.SignIn(this.loginForm.value);
  }

}