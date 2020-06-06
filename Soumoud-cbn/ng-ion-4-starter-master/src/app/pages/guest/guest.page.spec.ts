import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { GuestPage } from './guest.page';

describe('GuestPage', () => {
  let component: GuestPage;
  let fixture: ComponentFixture<GuestPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GuestPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(GuestPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
