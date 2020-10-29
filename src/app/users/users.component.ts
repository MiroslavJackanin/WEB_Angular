import { Component, OnInit } from '@angular/core';
import {User} from '../entities/user';
import {UsersService} from '../services/users.service';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  users = [];
  selectedUser: User;
  users$: Observable<User[]>;

  constructor( private usersService: UsersService ) { }

  ngOnInit(): void {
    // this.users = this.usersService.getUsers();
    this.users$ = this.usersService.getUsers();
    this.usersService.getUsers().subscribe(
      usersFromService => {
        console.log('Data arrived: ', usersFromService);
        this.users = usersFromService;
      },
      () => console.log('Data fetch ended'));
  }

  selectUser(user: User): void {
    this.selectedUser = user;
  }

}
