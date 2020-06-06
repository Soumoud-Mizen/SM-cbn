import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CreatePaymentMethodsPage } from './create-payment-methods.page';

describe('CreatePaymentMethodsPage', () => {
  let component: CreatePaymentMethodsPage;
  let fixture: ComponentFixture<CreatePaymentMethodsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatePaymentMethodsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CreatePaymentMethodsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
