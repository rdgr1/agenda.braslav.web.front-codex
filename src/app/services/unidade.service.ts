import { Injectable } from '@angular/core';
import { Unidade,  UnidadeCriar } from '../models/unidade.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UnidadeService {
  private url = `${environment.api}/api`;

  constructor(private httpClient : HttpClient) { 
  }

   obterUnidades():Observable<Unidade[]>{
      return this.httpClient.get<Unidade[]>(`${this.url}/unidades`)
    }
  
    criarUnidade(unidades: UnidadeCriar):Observable<Unidade>{ 
      return this.httpClient.post<Unidade>(`${this.url}/unidades`, unidades);
    }
  
    atualizarUnidade(id: string, unidades: Unidade): Observable<Unidade> {
      return this.httpClient.put<Unidade>(`${this.url}/unidades/${id}`, unidades);
    }
    
    deletarUnidade(id: string): Observable<void> {
      return this.httpClient.delete<void>(`${this.url}/unidades/${id}`);
    }
}
