import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IngresoObservaciones } from './ingreso-observaciones';

describe('IngresoObservaciones', () => {
  let component: IngresoObservaciones;
  let fixture: ComponentFixture<IngresoObservaciones>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IngresoObservaciones],
    }).compileComponents();

    fixture = TestBed.createComponent(IngresoObservaciones);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
