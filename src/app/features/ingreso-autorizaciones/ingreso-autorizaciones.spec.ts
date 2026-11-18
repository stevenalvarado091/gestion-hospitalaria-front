import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IngresoAutorizacionesComponent } from './ingreso-autorizaciones';
import { AutorizacionItemComponent } from '../../shared/components/autorizacion-item/autorizacion-item.component';

describe('IngresoAutorizacionesComponent', () => {

  let component: IngresoAutorizacionesComponent;
  let fixture: ComponentFixture<IngresoAutorizacionesComponent>;

  beforeEach(async () => {

    await TestBed.configureTestingModule({
      imports: [
        IngresoAutorizacionesComponent,
        AutorizacionItemComponent
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(IngresoAutorizacionesComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();

  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
