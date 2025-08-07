import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Cliente, ClienteCriar } from '../models/cliente.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private url = `${environment.api}/api`;

  constructor(private httpClient : HttpClient) { 
  }

  obterClientes():Observable<Cliente[]>{
    return this.httpClient.get<Cliente[]>(`${this.url}/clientes`)
  }

  criarCliente(cliente: ClienteCriar):Observable<Cliente>{ 
    return this.httpClient.post<Cliente>(`${this.url}/clientes`, cliente);
  }

  atualizarCliente(id: string, cliente: Cliente): Observable<Cliente> {
    return this.httpClient.put<Cliente>(`${this.url}/clientes/${id}`, cliente);
  }
  
  deletarCliente(id: string): Observable<void> {
    return this.httpClient.delete<void>(`${this.url}/clientes/${id}`);
  }

  buscarClientesFiltrados(nome?: string, cpf?: string, statusAtivo?: boolean): Observable<Cliente[]> {
    let params = new HttpParams();
  
    if (nome) params = params.set('nome', nome);
    if (cpf) params = params.set('cpf', cpf);
    if (typeof statusAtivo === 'boolean') {
      params = params.set('status', String(statusAtivo));
    }
  
    return this.httpClient.get<Cliente[]>(`${this.url}/clientes/buscar`, { params });
  }
  
}
