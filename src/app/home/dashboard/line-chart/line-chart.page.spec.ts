import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LineChartPage } from './line-chart.page';

describe('LineChartPage', () => {
  let component: LineChartPage;
  let fixture: ComponentFixture<LineChartPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LineChartPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LineChartPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
