import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntregaPageComponent } from './entrega-page.component';

describe('EntregaPageComponent', () => {
  let component: EntregaPageComponent;
  let fixture: ComponentFixture<EntregaPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntregaPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EntregaPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
