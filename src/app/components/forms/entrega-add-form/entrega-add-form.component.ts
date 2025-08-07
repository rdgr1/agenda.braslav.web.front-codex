import { Component,Inject, OnInit  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { provideNgxMask, NgxMaskDirective, } from 'ngx-mask';
import { EntregaService } from '../../../services/entrega.service';
import { Entrega, EntregaCriar } from '../../../models/entrega.model';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Cliente } from '../../../models/cliente.model';
import { ClienteService } from '../../../services/cliente.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-entrega-add-form',
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
  templateUrl: './entrega-add-form.component.html',
  styleUrl: './entrega-add-form.component.scss'
})
export class EntregaAddFormComponent {
  form!: FormGroup;
  isEditMode = false;
  clientes: Cliente[] = [];
  unidadeUuidSelecionada: string = '';


  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EntregaAddFormComponent>,
    private entregaService: EntregaService,
    private clienteService: ClienteService,
    @Inject(MAT_DIALOG_DATA) public data: Entrega,
    private toastr: ToastrService
  ) {}

  parseBoolean(value: any): boolean {
    return value === true || value === 'true';
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      clienteUuid: ['', Validators.required],
      uuid:[''],
      data: ['', Validators.required],
      hora: ['', Validators.required],
      cep: ['', Validators.required],
      endereco: ['', Validators.required],
      ticket: ['', Validators.required],
      observacao: [''],
      tipoEntrega: ['', Validators.required],
      statusEntrega: ['', Validators.required],
      pedenteSync: [true],
      ativa: [true]
    });
  
    this.clienteService.obterClientes().subscribe({
      next: clientes => {
        this.clientes = clientes;

        this.form.get('clienteUuid')?.valueChanges.subscribe(clienteUuid => {
          const cliente = this.clientes.find(c => c.uuid === clienteUuid);
          this.unidadeUuidSelecionada = cliente?.unidadeUuid ?? '';
        });
      },
      error: () => {
        this.toastr.error('Erro ao carregar clientes', 'Erro');
      }
    });
  
    if (this.data) {
      this.isEditMode = true;
      this.form.patchValue(this.data);
      this.unidadeUuidSelecionada = this.data.unidadeUuid;
    }
  }
  
  onSubmit() {
    if (this.form.invalid) return;
  
    // Clona o valor do formulário
    const formValue = { ...this.form.value };
  
    // Força campos críticos no formato correto
    formValue.tipoEntrega = formValue.tipoEntrega?.toUpperCase() || 'ENTREGA';
    formValue.statusEntrega = this.parseBoolean(formValue.statusEntrega);
  
    // Limpa máscaras
    const dataNumerica = formValue.data?.replace(/\D/g, '') ?? '';
    const horaNumerica = formValue.hora?.replace(/\D/g, '') ?? '';
  
    // Formata valores
    const dataValida = dataNumerica.length === 8
      ? `${dataNumerica.slice(0, 2)}/${dataNumerica.slice(2, 4)}/${dataNumerica.slice(4)}`
      : '00/00/0000';
  
    const horaValida = horaNumerica.length === 4
      ? `${horaNumerica.slice(0, 2)}:${horaNumerica.slice(2)}`
      : '00:00';
  
    // Monta objeto final com unidade
    const entregaComUnidade = {
      ...formValue,
      data: dataValida,
      hora: horaValida,
      unidadeUuid: this.unidadeUuidSelecionada,
    };
  
    // Edição
    if (this.isEditMode && this.data?.uuid) {
      const entregaEditada: Entrega = {
        uuid: this.data.uuid,
        ...entregaComUnidade,
      };
  
      this.entregaService.atualizarEntregas(this.data.uuid, entregaEditada).subscribe({
        next: () => {
          this.toastr.success('Entrega atualizada com sucesso!', 'Sucesso');
          this.dialogRef.close(true);
        },
        error: () => {
          this.toastr.error('Erro ao atualizar entrega', 'Erro');
        }
      });
    }
    // Criação
    else {
      const novaEntrega: EntregaCriar = entregaComUnidade;

      this.entregaService.criarEntregas(novaEntrega).subscribe({
        next: () => {
          this.toastr.success('Entrega criada com sucesso!', 'Sucesso');
          this.dialogRef.close(true);
        },
        error: () => {
          this.toastr.error('Erro ao criar entrega', 'Erro');
        }
      });
    }
  }
  
  
    onCancel() {
      this.dialogRef.close();
    }

}
