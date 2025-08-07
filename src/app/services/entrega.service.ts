import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Entrega, EntregaCriar } from '../models/entrega.model';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class EntregaService {

  private url = `${environment.api}/api`;

  constructor(private httpClient : HttpClient) { 
  }

  obterEntregas():Observable<Entrega[]>{
    return this.httpClient.get<Entrega[]>(`${this.url}/entregas`)
  }

  criarEntregas(entrega: EntregaCriar):Observable<Entrega>{ 
    return this.httpClient.post<Entrega>(`${this.url}/entregas`, entrega);
  }

  atualizarEntregas(id: string, entrega: Entrega): Observable<Entrega> {
    return this.httpClient.put<Entrega>(`${this.url}/entregas/${id}`, entrega);
  }
  
  deletarEntregas(id: string): Observable<void> {
    return this.httpClient.delete<void>(`${this.url}/entregas/${id}`);
  }

  buscarEntregasFiltradas(data: string, hora: string, status: string, cliente: string, unidade: string) {
    let params = new HttpParams();
    if (data) params = params.set('data', data);
    if (hora) params = params.set('hora', hora);
    if (status !== '' && status != null) params = params.set('status', status);
    if (cliente) params = params.set('clienteUuid', cliente);
    if (unidade) params = params.set('unidadeUuid', unidade);
  
    return this.httpClient.get<Entrega[]>(`${this.url}/entregas/buscar`, { params });
  }
  
  
}
