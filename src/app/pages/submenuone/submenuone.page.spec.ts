import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SubmenuonePage } from './submenuone.page';

describe('SubmenuonePage', () => {
  let component: SubmenuonePage;
  let fixture: ComponentFixture<SubmenuonePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubmenuonePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SubmenuonePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
