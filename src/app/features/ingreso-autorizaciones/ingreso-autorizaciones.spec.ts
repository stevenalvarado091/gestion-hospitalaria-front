import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IngresoAutorizaciones } from './ingreso-autorizaciones';

describe('IngresoAutorizaciones', () => {
  let component: IngresoAutorizaciones;
  let fixture: ComponentFixture<IngresoAutorizaciones>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IngresoAutorizaciones],
    }).compileComponents();

    fixture = TestBed.createComponent(IngresoAutorizaciones);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
