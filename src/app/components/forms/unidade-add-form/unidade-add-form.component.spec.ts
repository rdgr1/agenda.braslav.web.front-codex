import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnidadeAddFormComponent } from './unidade-add-form.component';

describe('UnidadeAddFormComponent', () => {
  let component: UnidadeAddFormComponent;
  let fixture: ComponentFixture<UnidadeAddFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnidadeAddFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnidadeAddFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
