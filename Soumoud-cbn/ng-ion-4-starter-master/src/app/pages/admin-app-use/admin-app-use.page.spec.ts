import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AdminAppUsePage } from './admin-app-use.page';

describe('AdminAppUsePage', () => {
  let component: AdminAppUsePage;
  let fixture: ComponentFixture<AdminAppUsePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminAppUsePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminAppUsePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
