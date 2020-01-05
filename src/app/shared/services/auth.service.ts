import { Injectable, NgZone } from '@angular/core';
import { Router } from "@angular/router";

import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { auth } from 'firebase/app';

import { ToastrService } from 'ngx-toastr';

import { User } from "../services/user";

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  userData: any; // Save logged in user data

  constructor(
    public afs: AngularFirestore,   // Inject Firestore service
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    public router: Router,
    private toastr: ToastrService,
    public ngZone: NgZone // NgZone service to remove outside scope warning
  ) {
    /* Guarda los datos del usuario localmente al logearse o registrarse, 
    se destruye el objeto cuando cierra sesion */
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user'));
      } else {
        localStorage.setItem('user', null);
        JSON.parse(localStorage.getItem('user'));
      }
    })
  }

  // Mensajes de alerta
  mensajeExito(titulo, mensaje) {
    this.toastr.success(mensaje, titulo);
  }
  mensajeError(titulo, mensaje) {
    this.toastr.error(mensaje, titulo);
  }

  // Logeo con email/password
  SignIn(email, password) {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .then((result) => {
        this.ngZone.run(() => {
          this.mensajeExito('¡Bienvenido!', '');
          this.router.navigate(['dashboard']);
        });
        this.SetUserData(result.user);
      }).catch((error) => {
        this.mensajeError('Error', error);
      })
  }

  // Registro con email/password
  SignUp(email, password) {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
      .then((result) => {
        /* Envia un correo para verificar la cuenta nueva */
        this.SendVerificationMail();
        this.SetUserData(result.user);
        this.mensajeExito('¡Exito!', 'Usuario registrado correctamente, verifica tu email para completar el registro');
      }).catch((error) => {
        this.mensajeError('Error', error);
      })
  }

  // Envia email de verificacion de registro
  SendVerificationMail() {
    return this.afAuth.auth.currentUser.sendEmailVerification()
      .then(() => {
        this.router.navigate(['verify-email-address']);
      })
  }

  // Resetea password
  ForgotPassword(passwordResetEmail) {
    return this.afAuth.auth.sendPasswordResetEmail(passwordResetEmail)
      .then(() => {
        window.alert('Se ha enviado un email, su contraseña ha sido reseteada, revise su bandeja de entrada.');
      }).catch((error) => {
        this.mensajeError('Error', error);
      })
  }

  // Returna true cuando el usuario esta logeado
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    return (user !== null && user.emailVerified !== false) ? true : false;
  }

  // Log in with Google
  GoogleAuth() {
    return this.AuthLogin(new auth.GoogleAuthProvider());
  }

  // Auth logic to run auth providers
  AuthLogin(provider) {
    return this.afAuth.auth.signInWithPopup(provider)
      .then((result) => {
        this.ngZone.run(() => {
          this.router.navigate(['dashboard']);
        })
        this.SetUserData(result.user);
      }).catch((error) => {
        this.mensajeError('Error', error);
      })
  }

  /* Recoge los datos del usuario y los guarda en el objeto User */
  SetUserData(user) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
    const userData: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified
    }
    return userRef.set(userData, { merge: true })
  }

  // Sign out 
  SignOut() {
    return this.afAuth.auth.signOut().then(() => {
      localStorage.removeItem('user');
      this.router.navigate(['sign-in']);
    })
  }

}