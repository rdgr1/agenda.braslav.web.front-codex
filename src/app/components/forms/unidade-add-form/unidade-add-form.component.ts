import { Component, Inject, OnInit  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { UnidadeService } from '../../../services/unidade.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Unidade, UnidadeCriar } from '../../../models/unidade.model';

@Component({
  selector: 'app-unidade-add-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
  
  ],
  templateUrl: './unidade-add-form.component.html',
  styleUrl: './unidade-add-form.component.scss'
})
export class UnidadeAddFormComponent {
  form!: FormGroup;
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private unidadeService: UnidadeService,
    private dialogRef: MatDialogRef<UnidadeAddFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Unidade
  ) {}

  ngOnInit(){
    this.form = this.fb.group({
      nome: ['', Validators.required],
    });
    if (this.data) {
      this.isEditMode = true;
      this.form.patchValue(this.data);
    }

  }

 onSubmit() {
     if (this.form.invalid) return;
 
     
     if (this.isEditMode && this.data?.uuid) {
      const unidade: Unidade = { uuid: this.data.uuid, ...this.form.value };
       this.unidadeService.atualizarUnidade(this.data.uuid, unidade).subscribe(() => {
         this.dialogRef.close(true);
        });
      } else {
       const unidade: UnidadeCriar = this.form.value;
       this.unidadeService.criarUnidade(unidade).subscribe(() => {
         this.dialogRef.close();
       });

     }
   }
 
   onCancel() {
     this.dialogRef.close();
   }
}
