import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ConsumerAppUsePage } from './consumer-app-use.page';

describe('ConsumerAppUsePage', () => {
  let component: ConsumerAppUsePage;
  let fixture: ComponentFixture<ConsumerAppUsePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsumerAppUsePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ConsumerAppUsePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
