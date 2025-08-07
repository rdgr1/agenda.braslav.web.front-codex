import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Usuario, UsuarioCriar } from '../models/usuario.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private url = `${environment.api}/api`;

  constructor(private httpClient : HttpClient) { 
  }

   obterUsuarios():Observable<Usuario[]>{
      return this.httpClient.get<Usuario[]>(`${this.url}/usuarios`)
    }
  
    criarUsuario(usuarios: UsuarioCriar, role: string, unidade: string): Observable<Usuario> {
      const params = new HttpParams()
        .set('role', role)
        .set('unidade', unidade);
    
      return this.httpClient.post<Usuario>(`${this.url}/usuarios`, usuarios, { params });
    }
    
  
    atualizarUsuario(id: string, usuarios: Usuario): Observable<Usuario> {
      return this.httpClient.put<Usuario>(`${this.url}/usuarios/${id}`, usuarios);
    }
    
    deletarUsuario(id: string): Observable<void> {
      return this.httpClient.delete<void>(`${this.url}/usuarios/${id}`);
    }

    alterarSenha(uuid: string, novaSenha: string): Observable<any> {
      return this.httpClient.put(`${this.url}/usuarios/${uuid}/alterar-senha`, { senha: novaSenha });
    }
    
}
