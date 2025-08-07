import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuarioAddFormComponent } from './usuario-add-form.component';

describe('UsuarioAddFormComponent', () => {
  let component: UsuarioAddFormComponent;
  let fixture: ComponentFixture<UsuarioAddFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsuarioAddFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsuarioAddFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
