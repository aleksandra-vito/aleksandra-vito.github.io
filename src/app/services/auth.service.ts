import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { auth } from 'firebase';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { Tutorial } from '../models/tutorial.model';
import { map } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { JobDescription } from '../models/jobdescr.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  authState: any = null;
  newUser: any;

  private dbPathUser = '/user';
  private job = '/job';

  userRef: AngularFireList<any>;

  private uid: any;

  loggedIn = new BehaviorSubject<boolean>(false);
  loggedIn$ = this.loggedIn.asObservable();

  constructor(
    public afu: AngularFireAuth,
    private router: Router,
    private db: AngularFirestore,
    private dbja: AngularFireDatabase,
    // private logger: NGXLogger
  ) {
    this.afu.authState.subscribe((auth => {
      this.authState = auth;
    }))
    this.userRef = dbja.list(this.dbPathUser);
  }

  // all firebase getdata functions
  get isUserAnonymousLoggedIn(): boolean {
    return (this.authState !== null) ? this.authState.isAnonymous : false
  }

  get currentUserId(): string {
    this.afu.authState.subscribe((auth => {
      this.authState = auth;
    }))
    return (this.authState !== null) ? this.authState.uid : ''
  }

  get currentUserName(): string {
    return this.authState['email']
  }

  get currentUser(): any {
    return (this.authState !== null) ? this.authState : null;
  }

  get isUserEmailLoggedIn(): boolean {
    if ((this.authState !== null) && (!this.isUserAnonymousLoggedIn)) {
      return true
    } else {
      return false
    }
  }

  registerWithEmail(email: string, password: string) {
    return this.afu.createUserWithEmailAndPassword(email, password)
      .then((user) => {
        this.authState = user
        this.afu.authState.subscribe((auth => {
          this.uid = auth.uid;
          this.insertUserData(this.uid)
        }))
      })
      .catch(error => {
        console.log(error)
        throw error
      });
  }

  insertUserData(uid) {
    let data = JSON.parse(localStorage.getItem('user'))
    let dataNew = {
      data,
      Id: uid
    }
    this.userRef = this.dbja.list(this.dbPathUser);
    return this.userRef.push(dataNew);
  }

  loginWithEmail(email: string, password: string) {
    return this.afu.signInWithEmailAndPassword(email, password)
      .then((user) => {
        this.authState = user
        return this.authState;
      })
      .catch(error => {
        console.log(error)
        throw error
      });
  }

  getAll(): AngularFireList<Tutorial> {
    this.userRef = this.dbja.list(this.dbPathUser);
    return this.userRef;
  }

  getAllJobs(): AngularFireList<JobDescription> {
    this.userRef = this.dbja.list(this.job);
    return this.userRef;
  }

  getUser(id): AngularFireList<any> {
    this.userRef = this.dbja.list(this.dbPathUser);
    this.dbja.object("/user").valueChanges().subscribe((details) => {
    });
    return this.userRef;
  }

  singout(): void {
    this.afu.signOut();
    this.router.navigate(['/login']);
  }

  // getUser(): Observable<UserNew | null> {
  //   return this.afAuth.authState.pipe(
  //     switchMap(u =>
  //       u ? this.userCollection.doc<UserNew>(u.uid).valueChanges() : null,
  //     ),
  //   );
  // }

  authenticated(): Observable<boolean> {
    return this.afu.authState.pipe(map(u => (u ? true : false)));
  }

  create(tutorial: JobDescription): any {
    this.userRef = this.dbja.list(this.job);
    return this.userRef.push(tutorial);
  }

  update(key: string, value: any): Promise<void> {
    this.userRef = this.dbja.list(this.job);
    return this.userRef.update(key, value);
  }

  delete(key: string): Promise<void> {
    this.userRef = this.dbja.list(this.job);
    return this.userRef.remove(key);
  }

  get isAuthenticated(): boolean {
    return this.authState !== null;
  }

  async getCurrentUser(): Promise<any | undefined> {
    return await this.authState.currentUser;
  }

}
