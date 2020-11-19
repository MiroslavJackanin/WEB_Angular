import { Component, OnInit} from '@angular/core';
import { Group } from '../../../app/entities/group';
import {ActivatedRoute, Router} from '@angular/router';
import { UsersService } from '../../../app/services/users.service';
import { switchMap } from 'rxjs/operators';
import { MessageService } from '../../../app/services/message.service';
import {Observable, of} from 'rxjs';
import {CanDeactivateComponent} from '../../../guards/can-deactivate.guard';

@Component({
  selector: 'app-group-edit',
  templateUrl: './group-edit.component.html',
  styleUrls: ['./group-edit.component.css']
})
export class GroupEditComponent implements OnInit, CanDeactivateComponent {

  group: Group;
  groupName: string;
  permString: string;
  buttonPressed = false;
  originalPermString: string;

  constructor(private route: ActivatedRoute, private usersService: UsersService, private messageService: MessageService, private router: Router) { }

  ngOnInit(): void {
    this.route.paramMap.pipe(switchMap(paramMap => {
      if (paramMap.has('id')){
        return this.usersService.getGroup(+paramMap.get('id'));
      } else {
        return of(new Group());
      }
    }))
      .subscribe(group => {
        this.group = group;
        if (this.group) {
          this.groupName = this.group.name;
          this.permString = this.group.permissions.join(' | ');

          this.originalPermString = this.permString;
        }
      });
  }

  onSubmit(): void {
    this.group.permissions = this.permString.split(' | ').map(perm => perm.trim()).filter(el => el);
    this.buttonPressed = true;
    this.usersService.saveGroup(this.group).subscribe(group => {
      this.messageService.showMessage('Group ' + group.name + ' saved successfully', false);
      this.groupName = group.name;
      this.buttonPressed = false;
      this.group = group;
      this.groupName = group.name;
      this.originalPermString = this.group.permissions.toString();
    });
  }

  canDeactivate(): boolean | Observable<boolean> {
    console.log('Deactivate guard in add group component');
    if (this.groupName === this.group.name && this.originalPermString === this.permString) {
      return true;
    }
    if (this.buttonPressed) {
      return true;
    }
    return window.confirm('Unfinished or unsaved form. Do you want to leave?');
  }

  cancel(): void {
    this.buttonPressed = true;
    this.router.navigateByUrl('groups/list');
  }
}
