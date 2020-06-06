import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ConsumersPage } from './consumers.page';

describe('ConsumersPage', () => {
  let component: ConsumersPage;
  let fixture: ComponentFixture<ConsumersPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsumersPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ConsumersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
