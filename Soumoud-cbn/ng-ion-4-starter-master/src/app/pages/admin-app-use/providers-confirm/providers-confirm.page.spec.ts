import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ProvidersConfirmPage } from './providers-confirm.page';

describe('ProvidersConfirmPage', () => {
  let component: ProvidersConfirmPage;
  let fixture: ComponentFixture<ProvidersConfirmPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProvidersConfirmPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ProvidersConfirmPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
