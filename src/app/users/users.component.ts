import { Component, OnInit } from '@angular/core';
import {User} from '../entities/user';
import {UsersService} from '../services/users.service';
import {Observable} from 'rxjs';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  users = [];
  selectedUser: User;
  users$: Observable<User[]>;
  errorMessage = '';

  constructor( private usersService: UsersService ) { }

  ngOnInit(): void {
    // this.users = this.usersService.getUsers();
    this.users$ = this.usersService.getUsers();
    this.usersService.getUsers().subscribe(
      usersFromService => {
        console.log('Data arrived: ', usersFromService);
        this.users = usersFromService;
      },
      error => {
        if (error instanceof HttpErrorResponse) {
          if (error.status === 0) {
            this.errorMessage = 'Server unavailable';
          } else {
            if (error.status >= 400 && error.status < 500){
              this.errorMessage = error.error.errorMessage;
            } else {
              this.errorMessage = 'Server error: ' + error.message;
            }
          }
        } else {
          this.errorMessage = 'Client error: ' + JSON.stringify(error);
        }
        console.error('Server error', error);
      },
      () => console.log('Data fetch ended'));
  }

  selectUser(user: User): void {
    this.selectedUser = user;
  }

}
