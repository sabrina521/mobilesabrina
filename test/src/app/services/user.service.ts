import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { AngularFireAuth } from "@angular/fire/auth";
import { Observable } from "rxjs";
import { User } from "../models/user.mode";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class UserService {
  private snapshotChangesSubscription: any;
  email = localStorage.getItem("email");
  constructor(public afs: AngularFirestore, public afAuth: AngularFireAuth) {}

  unsubscribeOnLogOut() {
    //remember to unsubscribe from the snapshotChanges
    this.snapshotChangesSubscription.unsubscribe();
  }

  // User related
  public getUserDetails(): Observable<User> {
    return new Observable<User>((observer) => {
      const email = localStorage.getItem("email");
      const docRef = this.afs.doc(`users/${email}`);
      const userData = docRef.get().subscribe(
        (res: any) => {
          observer.next(res.data());
          observer.complete();
        },
        (err) => {
          observer.error(err);
        }
      );
    });
  }
  public getUserDetailsById(email): Observable<User> {
    return new Observable<User>((observer) => {
      const docRef = this.afs.doc(`users/${email}`);
      const userData = docRef.get().subscribe(
        (res: any) => {
          observer.next(res.data());
          observer.complete();
        },
        (err) => {
          observer.error(err);
        }
      );
    });
  }

  public loadCurrentUserDetails() {
    let email = localStorage.getItem("email");
    return this.afs
      .doc(`users/${email}`)
      .snapshotChanges()
      .pipe(
        map((changes) => {
          let data = changes.payload.data();

          return data;
        })
      );
  }

  public updateUser(email: string, values: any): Observable<any> {
    return new Observable<any>((observer) => {
      const docRef = this.afs.doc(`users/${email}`);
      docRef.update(values).then(
        (res) => {
          observer.next(res);
          observer.complete();
        },
        (err) => {
          observer.error(err);
        }
      );
    });
  }

  public addUser(userDetails, email): Observable<any> {
    return new Observable<any>((observer) => {
      const docRef = this.afs.doc(`users/${email}`);
      docRef.set(userDetails).then(
        (res) => {
          observer.next(res);
          observer.complete();
        },
        (err) => {
          observer.error(err);
        }
      );
    });
  }

  deleteUser(email: string) {
    return new Observable<any>((observer) => {
      const docRef = this.afs.doc(`users/${email}`);
      docRef.delete().then(
        (res) => {
          observer.next(res);
          observer.complete();
        },
        (err) => {
          observer.error(err);
        }
      );
    });
  }
}

