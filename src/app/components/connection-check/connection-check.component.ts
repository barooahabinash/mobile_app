import { Component, OnInit,EventEmitter,Output } from '@angular/core';
import { DataService } from 'src/app/api/data.service';
import { ApiConnectionService } from 'src/app/services/api-connection/api-connection.service';

@Component({
  selector: 'app-connection-check',
  templateUrl: './connection-check.component.html',
  styleUrls: ['./connection-check.component.scss'],
})
export class ConnectionCheckComponent implements OnInit {
  @Output() retryReloadPageContent = new EventEmitter();
  constructor(private dataService:DataService,private ApiConnectionService:ApiConnectionService) { }

  ngOnInit() {}

  reload_page_content()
  {
    this.retryReloadPageContent.emit();
  }

}
