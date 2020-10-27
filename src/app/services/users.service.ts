import { Injectable } from '@angular/core';
import {User} from '../entities/user';
import {Observable, of, throwError} from 'rxjs';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';
import {Auth} from '../entities/auth';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private users = [
    new User('Miro', 'miro@mail.com', 1),
    new User('Marienka', 'marienka@mail.com', 2),
    new User('Jožko', 'jožko@mail.com', 3)];
  private serverUrl = 'http://localhost:8080/';
  private token: string = null;

  constructor(private http: HttpClient) { }

  login(auth: Auth): Observable<boolean> {
    return this.http.post(this.serverUrl + 'login', auth, {responseType: 'text'}).pipe(
      map(token => {
        this.token = token;
        return true;
      }),
      catchError(error => {
        if (error instanceof HttpErrorResponse && error.status === 401){
          return of(false);
        }
        return throwError(error);
      })
    );
  }

  getUsersSync(): User[] {
    return this.users;
  }

  getUsersAsync(): Observable<User[]> {
    return of(this.users);
  }

  getUsers(): Observable<User[]> {
    return this.http.get<Array<any>>(this.serverUrl + 'users').pipe(
      map(usersFromServer => this.mapToUsers(usersFromServer))
    );
  }

  getExtendedUsers(): Observable<User[]> {
    return this.http.get<Array<any>>(this.serverUrl + 'users/' + this.token).pipe(
      map(usersFromServer => this.mapToUsers(usersFromServer))
    );
  }

  mapToUsers(usersFromServer: Array<any>): User[]{
    return usersFromServer.map(u => new User(u.name, u.email, u.id));
  }
}
