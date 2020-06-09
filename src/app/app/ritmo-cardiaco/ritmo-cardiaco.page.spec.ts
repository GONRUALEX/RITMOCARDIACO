import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RitmoCardiacoPage } from './ritmo-cardiaco.page';

describe('RitmoCardiacoPage', () => {
  let component: RitmoCardiacoPage;
  let fixture: ComponentFixture<RitmoCardiacoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RitmoCardiacoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RitmoCardiacoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
