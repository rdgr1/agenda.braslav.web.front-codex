import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { provideNgxMask, NgxMaskDirective, } from 'ngx-mask';
import { UsuarioService } from '../../../services/usuario.service';
import { Usuario, UsuarioCriar } from '../../../models/usuario.model';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UnidadeService } from '../../../services/unidade.service';
import { RoleService } from '../../../services/role.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-usuario-add-form',
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
  providers: [provideNgxMask()],
  templateUrl: './usuario-add-form.component.html',
  styleUrl: './usuario-add-form.component.scss'
})
export class UsuarioAddFormComponent {
  form!: FormGroup;
  isEditMode = false;
  hide = true;
  roles: any[] = [];
  unidades: any[] = [];
  

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private unidadeService: UnidadeService,
    private roleService: RoleService,
    private dialogRef: MatDialogRef<UsuarioAddFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Usuario,
    private toastr: ToastrService
  ) {}

  parseBoolean(value: any): boolean {
    return value === true || value === 'true';
  }

  ngOnInit(){
    this.form = this.fb.group({
      uuid: [""],
      nome: ['', Validators.required],
      usuario: ['', Validators.required],
      email: ['', Validators.required],
      status: [, Validators.required],
      senha: ['',Validators.required],
      system: ['', Validators.required],
      roleUuid: ['',Validators.required],
      unidadeUuid: ['', Validators.required]
    });
    if (this.data) {
      this.isEditMode = true;
      this.form.patchValue(this.data);
    }

    this.roleService.obterRoles().subscribe({
      next: (roles) => {
        this.roles = roles;
      },
      error: () => {
        this.toastr.error('Erro ao carregar roles', 'Erro');
      }
    });

    this.unidadeService.obterUnidades().subscribe({
      next: (unidades) => {
        this.unidades = unidades;
      },
      error: () => {
        this.toastr.error('Erro ao carregar unidades', 'Erro');
      }
    });
    
  }


  onSubmit() {
    if (this.form.invalid) return;
  
    const formValue = { ...this.form.value };
  
    // Converte string para boolean se necessário
    formValue.status = this.parseBoolean(formValue.status);
  
    if (this.isEditMode && this.data?.uuid) {
      const usuario: Usuario = { uuid: this.data.uuid, ...formValue };
      this.usuarioService.atualizarUsuario(this.data.uuid, usuario).subscribe({
        next: () => {
          this.toastr.success('Usuário atualizado com sucesso!', 'Sucesso');
          this.dialogRef.close(true);
        },
        error: () => {
          this.toastr.error('Erro ao atualizar usuário', 'Erro');
        }
      });
    } else {
      const roleUuid = formValue.roleUuid;      // capturado para uso na requisição
      const unidadeUuid = formValue.unidadeUuid;
  
      // Remover os campos que não devem ir para o body
      delete formValue.unidadeUuid;
      delete formValue.roleUuid;
  
      // Adiciona lista vazia no lugar
      formValue.roleUuids = [];
  
      const usuario: UsuarioCriar = formValue;
  
      this.usuarioService.criarUsuario(usuario, roleUuid, unidadeUuid).subscribe({
        next: () => {
          this.toastr.success('Usuário criado com sucesso!', 'Sucesso');
          this.dialogRef.close(true);
        },
        error: () => {
          this.toastr.error('Erro ao criar usuário', 'Erro');
        }
      });
    }
  }
  
  
  
   onCancel() {
     this.dialogRef.close();
   }
}
