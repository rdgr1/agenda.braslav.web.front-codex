import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { Cliente, ClienteCriar } from '../../../models/cliente.model';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { provideNgxMask, NgxMaskDirective, } from 'ngx-mask';
import { ClienteService } from '../../../services/cliente.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UnidadeService } from '../../../services/unidade.service';
import { Unidade } from '../../../models/unidade.model';

@Component({
  selector: 'app-cliente-add-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    NgxMaskDirective,
  ],
  providers: [provideNgxMask()],
  templateUrl: './cliente-add-form.component.html',
  styleUrls: ['./cliente-add-form.component.scss']
})
export class ClienteFormComponent implements OnInit {
  form!: FormGroup;
  isEditMode = false;
  unidades: Unidade[] = [];

  constructor(
    private fb: FormBuilder,
    private clienteService: ClienteService,
    private unidadeService: UnidadeService,
    private dialogRef: MatDialogRef<ClienteFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Cliente // cliente opcional passado ao abrir o diálogo
  ) {}

   parseBoolean(value: any): boolean {
    return value === true || value === 'true';
  }
  
  ngOnInit(): void {
    this.form = this.fb.group({
      nome: ['', Validators.required],
      cpf: ['', Validators.required],
      telefone: ['', Validators.required],
      statusAtivo: [, Validators.required],
      unidadeUuid: ['', Validators.required],
      atualizadoEm: [''],
      pendenteSync: [true]
    });

    this.unidadeService.obterUnidades().subscribe((dados) => {
      this.unidades = dados;
    });

    if (this.data) {
      this.isEditMode = true;
      this.form.patchValue(this.data);
    }
  }

  onSubmit() {
    if (this.form.invalid) return;
    const formValue = this.form.value;
    formValue.statusAtivo = this.parseBoolean(formValue.statusAtivo);

    if (this.isEditMode && this.data?.uuid) {
      const cliente: Cliente = { uuid: this.data.uuid, ...this.form.value };
      console.log('Enviando cliente para atualização:', cliente); 
      this.clienteService.atualizarCliente(this.data.uuid, cliente).subscribe(() => {
        this.dialogRef.close(true);
      });
    } else {
      const cliente: ClienteCriar = this.form.value;
      console.log('Enviando cliente para criação:', cliente); 
      this.clienteService.criarCliente(cliente).subscribe(() => {
        this.dialogRef.close(true);
      });
    }
  }
  
  

  onCancel() {
    this.dialogRef.close();
  }
}