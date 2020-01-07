import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

import { AuthService } from "../../shared/services/auth.service";

import { User } from './../../shared/services/user';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})

export class SignUpComponent implements OnInit {

  constructor(
    public authService: AuthService,
    private formbuild: FormBuilder,
  ) { }

  registroForm: FormGroup;
  rolesList = [];


  ngOnInit() {
    this.buildForm();
    this.getRoles();
  }

  // Mensajes de validacion de inputs en tiempo real.
  account_validation_messages = {
    'correo': [
      { type: 'required', message: 'El email es requerido' },
      { type: 'pattern', message: 'Ingrese un email válido' }
    ],
    'clave': [
      { type: 'required', message: 'La contraseña es requerida' },
      { type: 'minlength', message: 'Password must be at least 5 characters long' },
      { type: 'pattern', message: 'Your password must contain at least one uppercase, one lowercase, and one number' }
    ]
  }

  /* Validador de formulario */
  buildForm(): void {
    this.registroForm = this.formbuild.group({
      name: ['', Validators.required],
      lastname: ['', Validators.required],
      correo: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      pass: ['', Validators.required,
        //Validators.minLength(6), Validators.pattern(/^(?=\D*\d)(?=[^a-z]*[a-z])(?=[^A-Z]*[A-Z]).{8,30}$/)
      ],
      pin: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(4)
      ])),
      rol: ['', Validators.required]
    });
  }

  getRoles() {
    this.authService.roles.subscribe(rols => {
      // Guarda todas los roles en una lista
      this.rolesList.push(rols);
    });
  };


  /* Registro usuario */
  registro() {
    this.authService.SignUp(this.registroForm.value);
  }

}

