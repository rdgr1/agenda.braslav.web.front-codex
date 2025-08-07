import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntregaAddFormComponent } from './entrega-add-form.component';

describe('EntregaAddFormComponent', () => {
  let component: EntregaAddFormComponent;
  let fixture: ComponentFixture<EntregaAddFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntregaAddFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EntregaAddFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
