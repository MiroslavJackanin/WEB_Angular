import { Component, OnInit } from '@angular/core';
import {Auth} from '../entities/auth';
import {UsersService} from '../services/users.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  auth = new Auth();

  constructor(private userService: UsersService, private router: Router) { }

  ngOnInit(): void {
  }

  get printAuth(): string {
      return JSON.stringify(this.auth);
  }

  changeName(event): void {
    this.auth.name = event.target.value;
  }

  onSubmit(): void {
    this.userService.login(this.auth).subscribe(success => {
      if (success) {
        console.log('Login Successful');
        this.router.navigateByUrl('/extended-users');
      }
    });
  }
}
