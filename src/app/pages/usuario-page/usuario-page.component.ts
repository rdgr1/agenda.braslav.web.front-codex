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
import { Usuario } from '../../models/usuario.model';
import { UsuarioService } from '../../services/usuario.service';
import { UsuarioAddFormComponent } from '../../components/forms/usuario-add-form/usuario-add-form.component';
import { PasswordDialogComponent } from '../../components/password-dialog/password-dialog.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-usuario-page',
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatDialogModule
  ],
  templateUrl: './usuario-page.component.html',
  styleUrl: './usuario-page.component.scss'
})
export class UsuarioPageComponent {
columnsToDisplay = ['nome', 'email', 'usuario', 'status', 'sistema', 'acoes'];
  dataSource = new MatTableDataSource<Usuario>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private dialog: MatDialog,
    private usuarioService: UsuarioService,
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.obterUsuarios();
  }
  obterUsuarios(): void {
    this.usuarioService.obterUsuarios().subscribe({
      next: usuarios => {
        this.dataSource.data = usuarios;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: () => {
        this.toastr.error('Erro ao carregar usuários', 'Erro');
      }
    });
  }

   editar(usuario: Usuario) {
      const dialogRef = this.dialog.open(UsuarioAddFormComponent, {
        width: '600px',
        data: usuario 
      });
    
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.obterUsuarios(); 
        }
      });
    }
    
  
    deletar(usuario: Usuario){
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '400px',
        data: { mensagem: `Deseja realmente excluir o usuario ${usuario.nome} ?`,
        textoConfrmar: 'Excluir' },
      });
    
      dialogRef.afterClosed().subscribe(confirmado => {
        if (confirmado) {
          this.usuarioService.deletarUsuario(usuario.uuid).subscribe({
            next: () => {
              this.toastr.success('Usuário deletado com sucesso!', 'Sucesso');
              this.obterUsuarios();
            },
            error: () => {
              this.toastr.error('Erro ao deletar usuário', 'Erro');
            }
          });
        }
      });
    }
    
  
  openForm() {
    const dialogRef = this.dialog.open(UsuarioAddFormComponent, {
      width: '600px',
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.obterUsuarios();
      }
    });
}

openAlterarSenhaDialog(usuario: Usuario) {
  const dialogRef = this.dialog.open(PasswordDialogComponent, {
    width: '400px',
    data: { uuid: usuario.uuid },
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
    }
  });
}



}
