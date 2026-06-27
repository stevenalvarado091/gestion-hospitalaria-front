import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IngresoCorreos } from './ingreso-correos';

describe('IngresoCorreos', () => {
  let component: IngresoCorreos;
  let fixture: ComponentFixture<IngresoCorreos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IngresoCorreos],
    }).compileComponents();

    fixture = TestBed.createComponent(IngresoCorreos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
