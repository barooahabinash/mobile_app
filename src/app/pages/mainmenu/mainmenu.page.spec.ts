import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MainmenuPage } from './mainmenu.page';

describe('MainmenuPage', () => {
  let component: MainmenuPage;
  let fixture: ComponentFixture<MainmenuPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainmenuPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MainmenuPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
