import { 
  Component, 
  OnInit, 
  Input, 
  Output, 
  EventEmitter 
} from '@angular/core';

@Component({
  selector: 'app-filter-section',
  templateUrl: './filter-section.component.html',
  styleUrls: ['./filter-section.component.scss'],
})
export class FilterSectionComponent implements OnInit {

  @Input() name: string;

  @Input() values: any[];

  @Input() type: string;

  @Output() radioGroupChangeEvent = new EventEmitter();

  @Output() ionFocusEvent = new EventEmitter();

  @Output() ionSelectEvent = new EventEmitter();

  @Output() ionBlurEvent = new EventEmitter();

  showSubItems: boolean = false;

  constructor() {}

  ngOnInit() 
    {
          this.values.forEach(element => {
            if (element.selected) this.showSubItems = true;
          });
    }

  radioGroupChange(event)
    {
          this.radioGroupChangeEvent.emit(event);
    }

    radioFocusChange(event) 
    {
          this.ionFocusEvent.emit(event);
    }

    radioSelectChange(event) 
    {
          this.ionSelectEvent.emit(event);
    }

    radioBlurChange() 
    {
          this.ionBlurEvent.emit();
    }

  toggleSubItems() 
    {
          this.showSubItems = !this.showSubItems;
    }
}
