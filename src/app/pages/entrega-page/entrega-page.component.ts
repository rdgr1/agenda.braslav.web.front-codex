import { Component, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, startWith, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { MatAutocompleteModule } from '@angular/material/autocomplete';


// Angular Material
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { provideNgxMask, NgxMaskDirective, } from 'ngx-mask';

// Serviços e componentes
import { EntregaService } from '../../services/entrega.service';
import { ClienteService } from '../../services/cliente.service';
import { UnidadeService } from '../../services/unidade.service';
import { EntregaAddFormComponent } from '../../components/forms/entrega-add-form/entrega-add-form.component';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';

// Modelos e Pipes
import { Entrega } from '../../models/entrega.model';
import { CepFormatPipe } from '../../pipes/cep-format.pipe';

@Component({
  selector: 'app-entrega-page',
  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatIconModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatTooltipModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatDialogModule,
    CepFormatPipe,
    MatInputModule,
    MatAutocompleteModule,
    MatSelectModule,
    MatOptionModule,
  ],
  providers: [provideNgxMask()],
  templateUrl: './entrega-page.component.html',
  styleUrl: './entrega-page.component.scss'
})
export class EntregaPageComponent implements OnInit {
  columnsToDisplay = ['nomeCliente', 'data', 'hora', 'cep', 'endereco', 'observacao', 'unidade', 'ticket-ROL','tipoEntrega', 'statusEntrega', 'acoes'];
  dataSource = new MatTableDataSource<Entrega>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  unidadeMap = new Map<string, string>();
  clienteMap = new Map<string, string>();

  dadosCarregados = false;
  filterAtivo = false;

  filtroForm!: FormGroup;

  clienteInputCtrl = new FormControl('');
  unidadeInputCtrl = new FormControl('');

  filteredClientes$!: Observable<any[]>;
  filteredUnidades$!: Observable<any[]>;

  clientesArray: { uuid: string, nome: string }[] = [];
  unidadesArray: { uuid: string, nome: string }[] = [];

  clienteUuidFiltro = '';
  unidadeUuidFiltro = '';

  constructor(
    private dialog: MatDialog,
    private entregaService: EntregaService,
    private clienteService: ClienteService,
    private unidadeService: UnidadeService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.filtroForm = this.fb.group({
      data: [''],
      hora: [''],
      status: ['']
      // cliente e unidade removidos para usar autocomplete separado
    });

    this.loadMapsAndData();

    // Setup autocomplete para cliente
    this.filteredClientes$ = this.clienteInputCtrl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterClientes(value || ''))
    );

    // Setup autocomplete para unidade
    this.filteredUnidades$ = this.unidadeInputCtrl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterUnidades(value || ''))
    );

    // Recarregar tabela ao mudar filtros
    this.filtroForm.valueChanges.pipe(debounceTime(300)).subscribe(() => {
      this.obterEntregas(this.getFiltros());
    });

    this.clienteInputCtrl.valueChanges.pipe(debounceTime(300)).subscribe(value => {
      const cliente = this.clientesArray.find(c => c.nome.toLowerCase() === value?.toLowerCase());
      this.clienteUuidFiltro = cliente ? cliente.uuid : '';
      this.obterEntregas(this.getFiltros());
    });
    

    this.unidadeInputCtrl.valueChanges.pipe(debounceTime(300)).subscribe(value => {
      const unidade = this.unidadesArray.find(u => u.nome.toLowerCase() === value?.toLowerCase());
      this.unidadeUuidFiltro = unidade ? unidade.uuid : '';
      this.obterEntregas(this.getFiltros());
    });
    
  }

  loadMapsAndData() {
    this.unidadeService.obterUnidades().subscribe(unidades => {
      this.unidadesArray = unidades;
      unidades.forEach(u => this.unidadeMap.set(u.uuid, u.nome));

      this.clienteService.obterClientes().subscribe(clientes => {
        this.clientesArray = clientes;
        clientes.forEach(c => this.clienteMap.set(c.uuid, c.nome));

        this.obterEntregas();
        this.dadosCarregados = true;
      });
    });
  }

  private _filterClientes(value: string) {
    const filterValue = value.toLowerCase();
    return this.clientesArray.filter(cliente =>
      cliente.nome.toLowerCase().includes(filterValue)
    );
  }

  private _filterUnidades(value: string) {
    const filterValue = value.toLowerCase();
    return this.unidadesArray.filter(unidade =>
      unidade.nome.toLowerCase().includes(filterValue)
    );
  }

  onClienteSelected(cliente: { uuid: string, nome: string }) {
    this.clienteUuidFiltro = cliente.uuid;
    this.clienteInputCtrl.setValue(cliente.nome, { emitEvent: false });
    this.obterEntregas(this.getFiltros());
  }

  onUnidadeSelected(unidade: { uuid: string, nome: string }) {
    this.unidadeUuidFiltro = unidade.uuid;
    this.unidadeInputCtrl.setValue(unidade.nome, { emitEvent: false });
    this.obterEntregas(this.getFiltros());
  }

  getFiltros() {
    const filtros = this.filtroForm.value;
    return {
      ...filtros,
      cliente: this.clienteUuidFiltro,
      unidade: this.unidadeUuidFiltro
    };
  }

  obterEntregas(filtros: any = {}) {
    const { data = '', hora = '', status = '', cliente = '', unidade = '' } = filtros;
    const temFiltro =
    [data, hora, cliente, unidade].some(v => !!v) || status === true || status === false;
  

    const obs$ = temFiltro
      ? this.entregaService.buscarEntregasFiltradas(data, hora, status, cliente, unidade)
      : this.entregaService.obterEntregas();

    obs$.subscribe(entregas => {
      this.dataSource.data = entregas;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  editar(entrega: Entrega) {
    const dialogRef = this.dialog.open(EntregaAddFormComponent, {
      width: '600px',
      data: entrega
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.obterEntregas(this.getFiltros());
      }
    });
  }

  deletar(entrega: Entrega) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: { mensagem: `Deseja realmente excluir essa entrega?`, textoConfirmar: 'Excluir' }
    });

    dialogRef.afterClosed().subscribe(confirmado => {
      if (confirmado) {
        this.entregaService.deletarEntregas(entrega.uuid).subscribe(() => {
          this.obterEntregas(this.getFiltros());
        });
      }
    });
  }

  openForm() {
    const dialogRef = this.dialog.open(EntregaAddFormComponent, {
      width: '600px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.obterEntregas(this.getFiltros());
      }
    });
  }

  get clienteEntries(): [string, string][] {
    return this.clienteMap ? Array.from(this.clienteMap.entries()) : [];
  }

  get unidadeEntries(): [string, string][] {
    return this.unidadeMap ? Array.from(this.unidadeMap.entries()) : [];
  }
}
