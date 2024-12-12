import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Shop } from '../interfaces/shop';
import { User } from '../interfaces/user';
import { HttpResponse } from '@angular/common/http';
export interface TeamCreateDto {
  id: number;
  name: string;
}

export interface TeamUpdateDto {
  name: string;
}
export interface TeamDetailsDto {
  id: number;
  name: string;
  creationDate: string;
  modificationDate: string;
  deletionDate: string;
}

@Injectable({
  providedIn: 'root',
})
export class ShopService {
  private apiUrl = 'http://localhost:8080/teams';

  constructor(private http: HttpClient) {}

  getById(id: number): Observable<TeamDetailsDto> {
    return this.http.get<TeamDetailsDto>(`${this.apiUrl}/${id}`);
  }

  getAll(): Observable<Shop[]> {
    return this.http.get<Shop[]>(`${this.apiUrl}/all`);
  }

  getByName(name: string): Observable<Shop[]> {
    return this.http.get<Shop[]>(`${this.apiUrl}/search?name=${name}`);
  }

  updateTeam(id: number, team: TeamUpdateDto): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/admin/update`, team)
  }

  deleteTeam(id:number): Observable<void> {
    const params = new HttpParams().set('id', id.toString())
    return this.http.delete<void>(`${this.apiUrl}/admin/delete`, {params})
  }

  createTeam(teamCreateDto: {name: string }): Observable<number>{
    return this.http.post<number>(`${this.apiUrl}/admin/create`, teamCreateDto)
  }

  searchTeamMembers(
    teamId: number,
    firstName?: string,
    lastName?: string,
    email?: string,
  ) {
    let params = `?teamId=${teamId}`;
    if (firstName) {
      params += `&firstName=${firstName}`;
    }
    if (lastName) {
      params += `&lastName=${lastName}`;
    }
    if (email) {
      params += `&email=${email}`;
    }
    return this.http.get<User[]>(`${this.apiUrl}/searchMembers${params}`);
  }

  addUserToTeam(
    teamId: number,
    userId: number,
  ): Observable<HttpResponse<string>> {
    console.log('Sending teamId:', teamId, 'and userId:', userId);
    const body = { teamId, userId };
    return this.http.post<string>(`${this.apiUrl}/addUser`, body, {
      observe: 'response',
      responseType: 'text' as 'json',
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    });
  }

  removeUserFromTeam(
    teamId: number,
    userId: number,
  ): Observable<HttpResponse<void>> {
    const body = { teamId, userId };
    return this.http.request<void>('DELETE', `${this.apiUrl}/removeUser`, {
      body: body,
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      observe: 'response',
    });
  }
}
