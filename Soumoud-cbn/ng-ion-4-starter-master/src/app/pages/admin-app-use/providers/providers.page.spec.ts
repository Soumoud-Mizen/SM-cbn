import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ProvidersPage } from './providers.page';

describe('ProvidersPage', () => {
  let component: ProvidersPage;
  let fixture: ComponentFixture<ProvidersPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProvidersPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ProvidersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
