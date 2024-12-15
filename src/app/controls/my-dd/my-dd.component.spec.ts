import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyDdComponent } from './my-dd.component';

describe('MyDdComponent', () => {
  let component: MyDdComponent;
  let fixture: ComponentFixture<MyDdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyDdComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyDdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
