import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BarPage } from './bar.page';

describe('BarPage', () => {
  let component: BarPage;
  let fixture: ComponentFixture<BarPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BarPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
