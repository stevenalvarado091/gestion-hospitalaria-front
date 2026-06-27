import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IngresoDetalle } from './ingreso-detalle';

describe('IngresoDetalle', () => {
  let component: IngresoDetalle;
  let fixture: ComponentFixture<IngresoDetalle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IngresoDetalle],
    }).compileComponents();

    fixture = TestBed.createComponent(IngresoDetalle);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
