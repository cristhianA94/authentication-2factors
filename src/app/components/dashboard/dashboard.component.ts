import { Component, TemplateRef, OnInit, NgZone } from '@angular/core';

import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Router } from "@angular/router";

import { AngularFireAuth } from "@angular/fire/auth";
import { AuthService } from "../../shared/services/auth.service";


import { User } from "../../shared/services/user";
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(
    public authService: AuthService,
    public afs: AngularFireAuth,
    public router: Router,
    public ngZone: NgZone,
    private modalService: BsModalService,
    private formbuild: FormBuilder
  ) { }

  public userList = [];
  public userId: any;
  pinSelec;
  private pinUser;

  pinForm: FormGroup;
  modalRef: BsModalRef;
  message: string;

  ngOnInit() {
    this.buildForm();
    this.getUser();

  }

  /* Validador de formulario */
  buildForm(): void {
    this.pinForm = this.formbuild.group({
      pin: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(4)
      ]))
    });
  }

  validar() {
    this.pinForm.valueChanges.subscribe(pin => {
      this.pinSelec = pin;
    });
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { class: 'modal-md' });
  }

  confirm(): void {
    if (this.pinSelec == this.pinUser) {
      console.log(this.userList[0].pin);

      this.message = 'Pin correcto!';
      this.modalRef.hide();
    } else {
      this.message = 'Pin incorrecto!';
    }
  }

  decline(): void {
    this.message = 'Cancelando...';
    this.modalRef.hide();
  }


  getUser() {
    this.authService.getAuth().subscribe(user => {
      if (user) {
        this.userId = user.uid;
        this.authService.getUser(this.userId).subscribe(userRole => {
          this.userList.push(userRole);
          this.pinUser = this.userList[0].pin;
        });
      }
    })
  }


}
