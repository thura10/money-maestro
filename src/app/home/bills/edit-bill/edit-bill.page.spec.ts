import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EditBillPage } from './edit-bill.page';

describe('EditBillPage', () => {
  let component: EditBillPage;
  let fixture: ComponentFixture<EditBillPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditBillPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EditBillPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
