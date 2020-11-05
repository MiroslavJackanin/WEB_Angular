import { Component, OnInit } from '@angular/core';
import { UsersService } from '../services/users.service';
import { User } from '../entities/user';
import {faUserTimes, faEdit, faCheck, faTimes} from '@fortawesome/free-solid-svg-icons';

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
  faEdit = faEdit;
  faDelete = faUserTimes;
  faActive = faCheck;
  faInactive = faTimes;

  constructor( private usersService: UsersService ) { }

  ngOnInit(): void {
    this.usersService.getExtendedUsers().subscribe(u => this.users = u);
  }

  saveUser(user: User): void {
    this.usersService.saveUser(user).subscribe(savedUser => {
      if (savedUser instanceof User) {
        if (user.id) {
          // this.users = this.users.map(u => u.id === user.id ? savedUser : u);
          this.users[this.users.findIndex(u => u.id === user.id)] = savedUser;
        } else {
          this.users = [...this.users, savedUser];
        }
      }
    });
  }

  onNewUserButtonClick(): void {
    this.editedUser = new User('', '');
    this.actionWithUser = 'Add new user';
    $('#user-edit-modal').modal('show');
  }

  editUser(user: User): void {
    this.editedUser = User.clone(user);
    this.actionWithUser = 'Edit user';
    $('#user-edit-modal').modal('show');
  }

  deleteUser(user: User): void {
    this.usersService.deleteUser(user).subscribe(ok => {
      this.users = this.users.filter(u => u !== user);
    });
  }
}
