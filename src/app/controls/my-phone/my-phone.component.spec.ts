import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyPhoneComponent } from './my-phone.component';

describe('MyPhoneComponent', () => {
  let component: MyPhoneComponent;
  let fixture: ComponentFixture<MyPhoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyPhoneComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyPhoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
