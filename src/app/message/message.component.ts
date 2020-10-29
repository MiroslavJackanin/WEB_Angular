import { Component, OnInit } from '@angular/core';
import {Message, MessageService} from '../services/message.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit {

  readonly MESSAGE_INTERVAL = 3000;
  message: string;
  messageType: 'danger' | 'success' = 'danger';

  constructor(private messageService: MessageService) { }

  ngOnInit(): void {
    this.messageService.message$.subscribe((m: Message) => {
      this.message = m.message;
      this.messageType = m.danger ? 'danger' : 'success';
      setTimeout(() => this.message = '', this.MESSAGE_INTERVAL);
    });
  }

}
