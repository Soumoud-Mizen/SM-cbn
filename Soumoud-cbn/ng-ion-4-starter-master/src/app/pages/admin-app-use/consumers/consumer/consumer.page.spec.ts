import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ConsumerPage } from './consumer.page';

describe('ConsumerPage', () => {
  let component: ConsumerPage;
  let fixture: ComponentFixture<ConsumerPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsumerPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ConsumerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
