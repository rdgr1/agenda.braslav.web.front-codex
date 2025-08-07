import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Sincronizacao, SincronizacaoCriar } from '../models//sincronizacao.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SincronizacaoService {
  private url = `${environment.api}/api`;

  constructor(private httpClient : HttpClient) { 
  }

  obterSincronizacoes():Observable<Sincronizacao[]>{
    return this.httpClient.get<Sincronizacao[]>(`${this.url}/sincronizacoes`)
  }

  criarSincronizacao(sincronizacao: SincronizacaoCriar):Observable<Sincronizacao>{ 
    return this.httpClient.post<Sincronizacao>(`${this.url}/sincronizacoes`, sincronizacao);
  }

  atualizarSincronizacao(id: string, sincronizacao: Sincronizacao): Observable<Sincronizacao> {
    return this.httpClient.put<Sincronizacao>(`${this.url}/sincronizacoes/${id}`, sincronizacao);
  }
  
  deletarSincronizacao(id: string): Observable<void> {
    return this.httpClient.delete<void>(`${this.url}/sincronizacoes/${id}`);
  }
  
}
