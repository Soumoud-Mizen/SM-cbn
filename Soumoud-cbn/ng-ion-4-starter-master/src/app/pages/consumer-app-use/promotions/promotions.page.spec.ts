import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PromotionsPage } from './promotions.page';

describe('PromotionsPage', () => {
  let component: PromotionsPage;
  let fixture: ComponentFixture<PromotionsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PromotionsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PromotionsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
