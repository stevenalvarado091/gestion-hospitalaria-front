import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevoIngreso } from './nuevo-ingreso';

describe('NuevoIngreso', () => {
  let component: NuevoIngreso;
  let fixture: ComponentFixture<NuevoIngreso>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NuevoIngreso],
    }).compileComponents();

    fixture = TestBed.createComponent(NuevoIngreso);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
