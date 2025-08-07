import { Component, ViewChild, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ClienteService } from '../../services/cliente.service';
import { Cliente } from '../../models/cliente.model';
import { CommonModule } from '@angular/common'; 
import { MatTableModule } from '@angular/material/table'; 
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip'; 
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { ClienteFormComponent } from '../../components/forms/cliente-add-form/cliente-add-form.component';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { TelefoneFormatPipe } from '../../pipes/telefone-format.pipe';
import { CpfFormatPipe } from '../../pipes/cpf-format.pipe';
import { UnidadeService } from '../../services/unidade.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-cliente-page',
  standalone: true,
  templateUrl: './cliente-page.component.html',
  styleUrls: ['./cliente-page.component.scss'],
  imports: [
    CommonModule,
    MatTableModule,
    ReactiveFormsModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatDialogModule,
    MatFormFieldModule, 
    MatInputModule,      
    MatSelectModule,     
    MatOptionModule,
    TelefoneFormatPipe,
    CpfFormatPipe
  ],
})

export class ClientePageComponent implements OnInit {
  columnsToDisplay = ['nome', 'cpf', 'telefone', 'unidade', 'status', 'acoes'];
  dataSource = new MatTableDataSource<Cliente>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  filtroForm!: FormGroup;
  filterAtivo = false;
  unidadeMap = new Map<string, string>();

  constructor(
    private dialog: MatDialog,
    private clienteService: ClienteService,
    private unidadeService: UnidadeService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.unidadeService.obterUnidades().subscribe({
      next: unidades => {
        unidades.forEach(u => {
          this.unidadeMap.set(u.uuid, u.nome);
        });

        this.obterClientes();
      },
      error: () => {
        this.toastr.error('Erro ao carregar unidades', 'Erro');
      }
    });
  
    this.filtroForm = this.fb.group({
      nome: [''],
      cpf: [''],
      statusAtivo: ['']
    });
  
    this.filtroForm.valueChanges.pipe(debounceTime(300)).subscribe(filtros => {
      this.obterClientes(filtros);
    });
  }
  

  obterClientes(filtros: any = {}): void {
    const nome = filtros.nome?.trim() || '';
    const cpf = filtros.cpf?.trim() || '';
    const statusAtivo = filtros.statusAtivo;
  
    const temFiltroAtivo = nome !== '' || cpf !== '' || statusAtivo !== null && statusAtivo !== undefined;
  
    if (temFiltroAtivo) {
  
      this.clienteService.buscarClientesFiltrados(nome, cpf, statusAtivo).subscribe({
        next: clientes => {
          this.dataSource.data = clientes;
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        },
        error: () => {
          this.toastr.error('Erro ao buscar clientes', 'Erro');
        }
      });
    } else {
      this.clienteService.obterClientes().subscribe({
        next: clientes => {
          this.dataSource.data = clientes;
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        },
        error: () => {
          this.toastr.error('Erro ao carregar clientes', 'Erro');
        }
      });
    }
  }

  editar(cliente: Cliente) {
    const dialogRef = this.dialog.open(ClienteFormComponent, {
      width: '600px',
      data: cliente // passa o cliente para o formulário
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.obterClientes(); // atualiza lista após edição
      }
    });
  }
  

  deletar(cliente: Cliente) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: { mensagem: `Deseja realmente excluir o cliente "${cliente.nome}"?`, textoConfirmar: 'Excluir'  },
    });
  
    dialogRef.afterClosed().subscribe(confirmado => {
      if (confirmado) {
        this.clienteService.deletarCliente(cliente.uuid).subscribe({
          next: () => {
            this.toastr.success('Cliente deletado com sucesso!', 'Sucesso');
            this.obterClientes();
          },
          error: () => {
            this.toastr.error('Erro ao deletar cliente', 'Erro');
          }
        });
      }
    });
  }
  
  
  openForm() {
    const dialogRef = this.dialog.open(ClienteFormComponent, {
      width: '600px',
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.obterClientes();
      }
    });
}

}
