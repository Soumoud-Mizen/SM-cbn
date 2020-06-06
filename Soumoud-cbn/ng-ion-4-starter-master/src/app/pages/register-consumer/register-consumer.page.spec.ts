import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RegisterConsumerPage } from './register-consumer.page';

describe('RegisterConsumerPage', () => {
  let component: RegisterConsumerPage;
  let fixture: ComponentFixture<RegisterConsumerPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegisterConsumerPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterConsumerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
