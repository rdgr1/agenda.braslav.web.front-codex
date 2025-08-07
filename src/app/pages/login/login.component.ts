import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ButtonComponent } from "../../components/button/button.component";
import { InputComponent } from "../../components/input/input.component";
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import {Toast, ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-login',
  imports: [ButtonComponent, InputComponent, CommonModule,ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit{
click: number = 0;
disabled = false;
loginForm: FormGroup;
isBrowser: boolean;
count: number = 0;
    constructor( @Inject(PLATFORM_ID) private platformId: object , private authService: AuthService, private router: Router, private toastr: ToastrService){
      this.isBrowser = isPlatformBrowser(platformId);
      this.loginForm = new FormGroup({
      email: new FormControl('',[Validators.required,Validators.minLength(1)]),
      password: new FormControl('',[Validators.required,Validators.minLength(6)])
      });
    }
    ngOnInit(): void {
        this.click = 0;
        this.count = 0;
    }
  submit(){
    if (this.loginForm.invalid){
        this.toastr.warning('Preencha os campos corretamente !','Aviso');
        return;
    };

    if (this.count >= 3) {
        this.toastr.warning('Aguarde e tente novamente mais tarde !', 'Aviso');
        this.disabled = true;
        return;
    }

    this.disabled = true;
    const { email,password } = this.loginForm.value;

    this.authService.login(email,password).subscribe({
      next: () => {
        this.toastr.success('Login efetuado com sucesso !','Sucesso');
        this.router.navigate(['homepage']);
        this.toastr.success('Bem-Vindo!','Aviso');
        this.count = 0;
      },
      error: (err) => {
        this.count++
        if (err.status === 401) {
          this.toastr.error('Credenciais inválidas. Verifique seu e-mail e senha.', 'Erro de autentitação');
        } else if (err.status === 0) {
          this.toastr.error('Sem conexão com o servidor. Tente novamente mais tarde.','Erro de rede');
        } else if (err.status >= 500) {
          this.toastr.error('Erro interno do servidor. Tente novamente mais tarde.', 'Erro');
        } else {
          this.toastr.error('Erro desconhecido. Tente novamente mais tarde.','Erro');
        }
        this.disabled = false;
      }
    })
  }
}
