import { Injectable, NgZone } from '@angular/core';
import { Router } from "@angular/router";

import { AngularFireAuth } from "@angular/fire/auth";
import {
  AngularFirestore,
  AngularFirestoreDocument,
  AngularFirestoreCollection
}
  from '@angular/fire/firestore';
import { auth } from 'firebase/app';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

import { User } from "./user";
import { Rol } from "./rol";

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  userData: any; // Save logged in user data

  usuarioCollection: AngularFirestoreCollection<User>;
  usuarioDoc: AngularFirestoreDocument<User>;
  usuarios: Observable<User[]>;
  usuario: Observable<User>;

  rolCollection: AngularFirestoreCollection<Rol>;
  rolDoc: AngularFirestoreDocument<Rol>;
  roles: Observable<Rol[]>;
  rol: Observable<Rol>;
  public rolSelect: string;

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
    this.getRoles();
  }

  // Mensajes de alerta
  mensajeExito(titulo, mensaje) {
    this.toastr.success(mensaje, titulo);
  }
  mensajeError(titulo, mensaje) {
    this.toastr.error(mensaje, titulo);
  }

  getAuth() {
    return this.afAuth.authState;
  }

  // Registro con email/password
  RolSelect(form) {
    this.rolSelect = form.rol;
    return this.rolSelect;
  }

  // Logeo con email/password
  SignIn(form) {
    return this.afAuth.auth.signInWithEmailAndPassword(form.correo, form.pass)
      .then((result) => {
        this.ngZone.run(() => {
          this.mensajeExito('¡Bienvenido!', '');
          this.router.navigate(['dashboard']);
        });
        //this.SetUserData(result.user);
      }).catch((error) => {
        this.mensajeError('Error', error);
      })
  }


  // Registro con email/password
  SignUp(form) {
    return this.afAuth.auth.createUserWithEmailAndPassword(form.correo, form.pass)
      .then((result) => {
        /* Envia un correo para verificar la cuenta nueva */
        this.SendVerificationMail();
        this.SetUserData(result.user, form);
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


  /* Recoge los datos del usuario y los guarda en el objeto User */
  SetUserData(user, form?) {
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);
    const userData: User = {
      uid: user.uid,
      correo: user.email,
      name: form.name,
      lastname: form.lastname,
      photoURL: user.photoURL,
      pin: form.pin,
      rol: form.rol
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

  /*                        USER                   */

  rolUser(uid) {
    return this.afs.doc<User>(`users/${uid}`).snapshotChanges();
  }


  //Obtiene un usuario
  getUser(uid) {
    this.usuarioDoc = this.afs.doc<User>(`users/${uid}`);
    return this.usuario = this.usuarioDoc.snapshotChanges().pipe(
      map(action => {
        if (action.payload.exists === false) {
          return null;
        } else {
          const data = action.payload.data() as User;
          data.uid = action.payload.id;
          return data;
        }
      }));
  }

  /*                        ROLES                           */
  //Obtiene un rol
  getRoles() {
    // Obtiene todos los roles
    this.rolCollection = this.afs.collection('rol');
    this.roles = this.rolCollection.snapshotChanges().pipe(map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as Rol;
        data.id = a.payload.doc.id;
        return data;
      })
    }));
  }

}