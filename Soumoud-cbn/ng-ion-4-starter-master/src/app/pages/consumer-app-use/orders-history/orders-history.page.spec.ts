import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OrdersHistoryPage } from './orders-history.page';

describe('OrdersHistoryPage', () => {
  let component: OrdersHistoryPage;
  let fixture: ComponentFixture<OrdersHistoryPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrdersHistoryPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OrdersHistoryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
