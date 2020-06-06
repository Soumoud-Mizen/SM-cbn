import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MainAppUsePage } from './main-app-use.page';

describe('MainAppUsePage', () => {
  let component: MainAppUsePage;
  let fixture: ComponentFixture<MainAppUsePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainAppUsePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MainAppUsePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
