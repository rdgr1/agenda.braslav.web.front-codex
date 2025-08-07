import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { UsuarioService } from '../../services/usuario.service'; 
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-password-dialog',
  standalone: true,
  templateUrl: './password-dialog.component.html',
  styleUrl: './password-dialog.component.scss',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
  ]
})
export class PasswordDialogComponent {
  form: FormGroup;
  hide = true;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<PasswordDialogComponent>,
    private usuarioService: UsuarioService,
    @Inject(MAT_DIALOG_DATA) public data: { uuid: string }
  ) {
    this.form = this.fb.group({
      senha: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit() {
    console.log('UUID recebido:', this.data.uuid);
  }
  

  onSubmit() {
    if (this.form.invalid) return;

    this.usuarioService.alterarSenha(this.data.uuid, this.form.value.senha).subscribe(() => {
      this.dialogRef.close(true);
    });
  }

  onCancel() {
    this.dialogRef.close();
  }
}
