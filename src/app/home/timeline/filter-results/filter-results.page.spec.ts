import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FilterResultsPage } from './filter-results.page';

describe('FilterResultsPage', () => {
  let component: FilterResultsPage;
  let fixture: ComponentFixture<FilterResultsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilterResultsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FilterResultsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
