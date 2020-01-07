import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

import { AuthService } from "../../shared/services/auth.service";

@Component({
  selector: 'app-rols',
  templateUrl: './rols.component.html',
  styleUrls: ['./rols.component.css']
})
export class RolsComponent implements OnInit {

  constructor(
    public authService: AuthService,
    private formbuild: FormBuilder,
    private router: Router
  ) { }

  rolForm: FormGroup;
  rolesList = [];


  ngOnInit() {
    this.buildForm();
    this.getRoles();
  }

  /* Validador de formulario */
  buildForm(): void {
    this.rolForm = this.formbuild.group({
      rol: ['', Validators.required]
    });
  }

  getRoles() {
    this.authService.roles.subscribe(rols => {
      // Guarda todas los roles en una lista
      this.rolesList.push(rols);
    });
  };


  elegirRol() {
    this.authService.RolSelect(this.rolForm.value);
    console.log("media");
    
    this.router.navigate(['/sign-in']);
  }

}
