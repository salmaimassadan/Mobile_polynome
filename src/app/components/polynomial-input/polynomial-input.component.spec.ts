import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PolynomialInputComponent } from './polynomial-input.component';

describe('PolynomialInputComponent', () => {
  let component: PolynomialInputComponent;
  let fixture: ComponentFixture<PolynomialInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PolynomialInputComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PolynomialInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
