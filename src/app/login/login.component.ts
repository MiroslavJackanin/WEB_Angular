import { Component, OnInit } from '@angular/core';
import {Auth} from '../entities/auth';
import {UsersService} from '../services/users.service';
import {HttpErrorResponse} from '@angular/common/http';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  auth = new Auth();
  errorMessage = '';

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
        this.router.navigateByUrl('/users');
      } else {
        this.errorMessage = 'Wrong login or password';
        setTimeout(() => this.errorMessage = '', 3000);
      }
    },
    error => {
      if (error instanceof HttpErrorResponse) {
        if (error.status === 0){
          this.errorMessage = 'Server unavailable';
        } else {
          if (error.status >= 400 && error.status < 500) {
            this.errorMessage = error.error.errorMessage;
          } else {
            this.errorMessage = 'Server error: ' + error.message;
          }
        }
      } else {
        this.errorMessage = 'Client error: ' + JSON.stringify(error);
      }
      console.error('Unknown error: ', error);
    });
  }
}
