import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Role } from '../models/role.model';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  private url = `${environment.api}/api`;
  constructor(private httpClient: HttpClient) {}

  obterRoles(): Observable<Role[]> {
    return this.httpClient.get<Role[]>(`${this.url}/roles`);
  }
}
