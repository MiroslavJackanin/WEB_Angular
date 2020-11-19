import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Group } from '../../../app/entities/group';
import { UsersService } from '../../../app/services/users.service';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-group-detail',
  templateUrl: './group-detail.component.html',
  styleUrls: ['./group-detail.component.css']
})
export class GroupDetailComponent implements OnInit {

  // groupId: string;
  group: Group | void;

  constructor(private route: ActivatedRoute, private usersService: UsersService) { }

  ngOnInit(): void {
    this.route.paramMap.pipe(switchMap(paramMap => this.usersService.getGroup(+paramMap.get('id'))))
      .subscribe(group => this.group = group);
    /*this.route.paramMap.pipe(map(paramMap => paramMap.get('id')))
      .subscribe(id => {
        this.groupId = id;
        this.usersService.getGroup(+this.groupId).subscribe(g => this.group = g);
      });*/
  }

}
