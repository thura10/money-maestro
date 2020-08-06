import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PieChartPage } from './pie-chart.page';

describe('PieChartPage', () => {
  let component: PieChartPage;
  let fixture: ComponentFixture<PieChartPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PieChartPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PieChartPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
