import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { CommonModule } from '@angular/common'; 
import { MatTableModule } from '@angular/material/table'; 
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip'; 
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';
import { Unidade } from '../../models/unidade.model';
import { UnidadeService } from '../../services/unidade.service';
import { UnidadeAddFormComponent } from '../../components/forms/unidade-add-form/unidade-add-form.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-unidade-page',
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatDialogModule
  ],
  templateUrl: './unidade-page.component.html',
  styleUrl: './unidade-page.component.scss'
})
export class UnidadePageComponent {

   columnsToDisplay = ['nome', 'acoes'];
  dataSource = new MatTableDataSource<Unidade>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private dialog: MatDialog,
    private unidadeService: UnidadeService,
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.obterUnidades();
  }

  obterUnidades(): void {
    this.unidadeService.obterUnidades().subscribe({
      next: unidades => {
        this.dataSource.data = unidades;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: () => {
        this.toastr.error('Erro ao carregar unidades', 'Erro');
      }
    });
  }

   editar(unidade: Unidade) {
      const dialogRef = this.dialog.open(UnidadeAddFormComponent, {
        width: '600px',
        data: unidade 
      });
    
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.obterUnidades(); 
        }
      });
    }
    
  
    deletar(unidade: Unidade){
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '400px',
        data: { mensagem: `Deseja realmente excluir a unidade ${unidade.nome} ?`, textoConfirmar: 'Excluir' },
      });
    
      dialogRef.afterClosed().subscribe(confirmado => {
        if (confirmado) {
          this.unidadeService.deletarUnidade(unidade.uuid).subscribe({
            next: () => {
              this.toastr.success('Unidade deletada com sucesso!', 'Sucesso');
              this.obterUnidades();
            },
            error: () => {
              this.toastr.error('Erro ao deletar unidade', 'Erro');
            }
          });
        }
      });
    }
    
  
    openForm() {
      const dialogRef = this.dialog.open(UnidadeAddFormComponent, {
        width: '600px',
      });
    
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.obterUnidades(); 
        }
      });
    }
    
}
