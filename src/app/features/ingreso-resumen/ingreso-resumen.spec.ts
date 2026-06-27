import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IngresoResumen } from './ingreso-resumen';

describe('IngresoResumen', () => {
  let component: IngresoResumen;
  let fixture: ComponentFixture<IngresoResumen>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IngresoResumen],
    }).compileComponents();

    fixture = TestBed.createComponent(IngresoResumen);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
