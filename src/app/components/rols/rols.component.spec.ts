import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RolsComponent } from './rols.component';

describe('RolsComponent', () => {
  let component: RolsComponent;
  let fixture: ComponentFixture<RolsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RolsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RolsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
