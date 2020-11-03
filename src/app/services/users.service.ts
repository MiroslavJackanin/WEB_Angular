import { Injectable } from '@angular/core';
import {User} from '../entities/user';
import {EMPTY, Observable, of, Subscriber} from 'rxjs';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';
import {Auth} from '../entities/auth';
import {MessageService} from './message.service';
import {Group} from '../entities/group';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private users = [new User('Miro', 'miro@mail.com', 1)];
  private serverUrl = 'http://localhost:8080/';
  private loggedUserSubscriber: Subscriber<string>;

  constructor(private http: HttpClient, private messageService: MessageService) { }

  set token(value: string) {
    if (value) {
      localStorage.setItem('token', value);
    }else {
      localStorage.removeItem('token');
    }
  }

  set user(value: string){
    this.loggedUserSubscriber.next(value);
    if (value){
      localStorage.setItem('user', value);
    }else {
      localStorage.removeItem('user');
    }
  }

  get user(): string {
    return localStorage.getItem('user');
  }

  get token(): string {
    return localStorage.getItem('token');
  }

  getUserObservable(): Observable<string> {
    return new Observable(subscriber => {
      this.loggedUserSubscriber = subscriber;
      subscriber.next(this.user);
    });
  }

  login(auth: Auth): Observable<boolean | void> {
    return this.http.post(this.serverUrl + 'login', auth, {responseType: 'text'}).pipe(
      map(token => {
        this.token = token;
        this.user = auth.name;
        this.messageService.showMessage('Welcome ' + auth.name + '. Login successful', false);
        return true;
      }),
      catchError(error => {
        this.logout();
        return this.processHttpError(error);
      })
    );
  }

  logout(): void {
    this.token = null;
    this.user = null;
  }

  getUsersSync(): User[] {
    return this.users;
  }

  getUsersAsync(): Observable<User[]> {
    return of(this.users);
  }

  getUsers(): Observable<User[]> {
    return this.http.get<Array<any>>(this.serverUrl + 'users').pipe(
      map(usersFromServer => this.mapToUsers(usersFromServer),
      catchError(error => this.processHttpError(error)))
    );
  }

  getExtendedUsers(): Observable<User[]> {
    return this.http.get<Array<any>>(this.serverUrl + 'users/' + this.token).pipe(
      map(usersFromServer => this.mapToExtendedUsers(usersFromServer),
      catchError(error => this.processHttpError(error)))
    );
  }

  mapToUsers(usersFromServer: Array<any>): User[]{
    return usersFromServer.map(u => new User(u.name, u.email, u.id));
  }

  mapToExtendedUsers(usersFromServer: Array<any>): User[]{
    return usersFromServer.map(u => User.clone(u));
  }

  saveUser(user: User): Observable<void | User> {
    return this.http.post<User>(this.serverUrl + 'users/' + this.token, user).pipe(
      map(usersFromServer => User.clone(usersFromServer)),
      catchError(error => this.processHttpError(error))
    );
  }

  getGroups(): Observable<Group[] | void> {
    return this.http.get<Group[]>(this.serverUrl + 'groups/').pipe(
      catchError(error => this.processHttpError(error)));
  }

  processHttpError(error): Observable<void> {
    if (error instanceof HttpErrorResponse) {
      if (error.status === 0) {
        this.messageService.showMessage('Server unavailable');
      } else {
        if (error.status >= 400 && error.status < 500){
          /*if (error.error.errorMessage) {
            this.messageService.showMessage(error.error.errorMessage);
          }else {
            this.messageService.showMessage(JSON.parse(error.error).errorMessage);
          }*/
          this.messageService.showMessage(error.error.errorMessage ? error.error.errorMessage : JSON.parse(error.error).errorMessage);
        } else {
          this.messageService.showMessage('Server error: ' + error.message);
        }
      }
    } else {
      this.messageService.showMessage('Client error: ' + JSON.stringify(error));
    }
    console.error('Server error', error);
    return EMPTY;
  }
}
