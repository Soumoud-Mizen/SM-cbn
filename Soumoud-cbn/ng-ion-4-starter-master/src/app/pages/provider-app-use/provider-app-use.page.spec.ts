import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ProviderAppUsePage } from './provider-app-use.page';

describe('ProviderAppUsePage', () => {
  let component: ProviderAppUsePage;
  let fixture: ComponentFixture<ProviderAppUsePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProviderAppUsePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ProviderAppUsePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
