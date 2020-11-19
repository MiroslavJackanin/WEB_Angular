import { Component, OnInit } from '@angular/core';
import {Auth} from '../entities/auth';
import {UsersService} from '../services/users.service';
import {Router} from '@angular/router';
import {CanDeactivateComponent} from '../../guards/can-deactivate.guard';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, CanDeactivateComponent {
  auth = new Auth();
  originalAuth = new Auth();
  submitted = false;

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
        this.submitted = true;
        console.log('Login Successful');
        this.router.navigateByUrl(this.userService.redirectAfterLogin);
        this.userService.setDefaultRedirect();
      }
    });
  }

  canDeactivate(): boolean | Observable<boolean> {
    console.log('Deactivate guard in login component');
    if (this.originalAuth.name === this.auth.name &&
      this.originalAuth.password === this.auth.password) {
      return true;
    }
    if (this.submitted) {
      return true;
    }
    return window.confirm('Unfinished form. Do you want to leave?');
  }
}
