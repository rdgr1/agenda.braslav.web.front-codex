import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnidadePageComponent } from './unidade-page.component';

describe('UnidadePageComponent', () => {
  let component: UnidadePageComponent;
  let fixture: ComponentFixture<UnidadePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnidadePageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnidadePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
