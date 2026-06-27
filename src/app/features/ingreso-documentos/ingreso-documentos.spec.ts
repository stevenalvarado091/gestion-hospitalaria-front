import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IngresoDocumentos } from './ingreso-documentos';

describe('IngresoDocumentos', () => {
  let component: IngresoDocumentos;
  let fixture: ComponentFixture<IngresoDocumentos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IngresoDocumentos],
    }).compileComponents();

    fixture = TestBed.createComponent(IngresoDocumentos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
