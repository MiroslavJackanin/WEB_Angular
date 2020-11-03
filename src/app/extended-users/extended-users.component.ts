import { Component, OnInit } from '@angular/core';
import {UsersService} from '../services/users.service';
import {User} from '../entities/user';

declare var $: any;

@Component({
  selector: 'app-extended-users',
  templateUrl: './extended-users.component.html',
  styleUrls: ['./extended-users.component.css']
})
export class ExtendedUsersComponent implements OnInit {

  users: User[];
  editedUser: User;
  actionWithUser: string;

  constructor( private usersService: UsersService ) { }

  ngOnInit(): void {
    this.usersService.getExtendedUsers().subscribe(u => this.users = u);
  }

  saveUser(user: User): void {
    this.usersService.saveUser(user).subscribe(savedUser => {
      if (savedUser instanceof User) {
        this.users = [...this.users, savedUser];
      }
    });
  }

  onNewUserButtonClick(): void {
    this.editedUser = new User('', '');
    this.actionWithUser = 'Add new user';
    $('#user-edit-modal').modal('show');

  }
}
