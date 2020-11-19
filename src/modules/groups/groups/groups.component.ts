import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../../app/services/users.service';
import { Group } from '../../../app/entities/group';
import { faEdit } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.css']
})
export class GroupsComponent implements OnInit {

  groups: Group[] | void;
  faEdit = faEdit;

  constructor(private usersService: UsersService) { }

  ngOnInit(): void {
    this.usersService.getGroups().subscribe(g => this.groups = g);
  }

}
