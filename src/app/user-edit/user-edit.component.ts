import {Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';
import {User} from '../entities/user';
import {Group} from '../entities/group';
import {UsersService} from '../services/users.service';

declare var $: any;

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnChanges {

  @Output('saved') saved$ = new EventEmitter<User>();
  @Input() user: User;
  @Input() actionWithUser: string;
  groups: Map<Group, boolean> = new Map<Group, boolean>();

  constructor(private usersService: UsersService) { }

  ngOnChanges(): void {
    this.usersService.getGroups().subscribe(groups => {
      this.groups.clear();
      if (groups instanceof Array) {
        groups.forEach(group => {
          if (this.user.groups.findIndex(userGroup => userGroup.id === group.id) >= 0) {
            this.groups.set(group, true);
          } else {
            this.groups.set(group, false);
          }
        });
      }
    });
  }

  toggleGroup(event: any, group: Group): void {
    const checked = event.target.checked;
    this.groups.set(group, checked);
    if (checked) {
      this.user.groups = [...this.user.groups, group];
    } else {
      this.user.groups = this.user.groups.filter(gr => gr.id !== group.id);
    }
  }

  get printUser(): string {
    return JSON.stringify(this.user);
  }

  onSubmit(): void {
    this.saved$.emit(this.user);
    $('#user-edit-modal').modal('hide');
  }
}
