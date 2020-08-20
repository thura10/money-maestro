import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddBillPage } from './add-bill.page';

describe('AddBillPage', () => {
  let component: AddBillPage;
  let fixture: ComponentFixture<AddBillPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddBillPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddBillPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
