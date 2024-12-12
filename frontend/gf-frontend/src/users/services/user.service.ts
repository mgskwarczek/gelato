import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../interfaces/user';
import { Shop } from '../interfaces/shop';
import { UserUpdateDto } from '../interfaces/user-update-dto';

export interface PaginatedUsersResponse {
  users: User[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:8080/users';

  constructor(private http: HttpClient) {}

  getById(userId: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${userId}`);
  }

  getAllUsers(
    pageIndex: number,
    pageSize: number,
  ): Observable<{ users: User[]; totalItems: number; currentPage: number }> {
    let params = new HttpParams()
      .set('page', pageIndex.toString())
      .set('size', pageSize.toString());
    return this.http.get<PaginatedUsersResponse>(
      `${this.apiUrl}/admin/paginated`,
      {
        params,
      },
    );
  }

  searchByEmail(email: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/searchByEmail?email=${email}`);
  }

  searchByCriteria(
    firstName?: string,
    lastName?: string,
    email?: string,
  ): Observable<User[]> {
    let params = new HttpParams();
    if (firstName) params = params.set('firstName', firstName);
    if (lastName) params = params.set('lastName', lastName);
    if (email) params = params.set('email', email);

    return this.http.get<User[]>(`${this.apiUrl}/search`, { params });
  }

  createUser(userPayload: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/admin/create`, userPayload);
  }

  getRoles(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/admin/getAllRoles`);
  }

  updateUser(userId: number, user: UserUpdateDto): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/admin/update`, user);
  }

  deleteUser(userId: number): Observable<void> {
    return this.http.request<void>(
      'DELETE',
      `${this.apiUrl}/admin/delete?id=${userId}`,
    );
  }

  searchUsers(
    formValues: any,
    pageIndex: number,
    pageSize: number,
  ): Observable<PaginatedUsersResponse> {
    let params = new HttpParams()
      .set('page', pageIndex.toString())
      .set('size', pageSize.toString());

    Object.keys(formValues).forEach((key) => {
      if (formValues[key]) {
        params = params.set(key, formValues[key]);
      }
    });

    return this.http.get<PaginatedUsersResponse>(
      `${this.apiUrl}/admin/allUsers`,
      {
        params,
      },
    );
  }

  getUsersByRoleName(roleName: string): Observable<User[]> {
    const params = new HttpParams().set('roleName', roleName);
    return this.http.get<User[]>(
      `${this.apiUrl}/admin/findByRole?roleName=${roleName}`,
    );
  }

  usersNotInShop(
    shopId: number,
    firstName?: string,
    lastName?: string,
    email?: string,
  ): Observable<User[]> {
    let params = `?teamId=${shopId}`;
    if (firstName) {
      params += `&firstName=${firstName}`;
    }
    if (lastName) {
      params += `&lastName=${lastName}`;
    }
    if (email) {
      params += `&email=${email}`;
    }
    return this.http.get<User[]>(
      `${this.apiUrl}/searchUsersNotInShop${params}`,
    );
  }

  changePassword(payload: {
    userId: number;
    currentPassword: string;
    newPassword: string;
  }): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/changePassword`, payload, {
      responseType: 'text' as 'json',
    });
  }

  getShopsByUserId(userId: number): Observable<Shop[]> {
    return this.http.get<Shop[]>(`${this.apiUrl}/shops/${userId}`);
  }


  searchUsersWithFilters(filters: any, page: number = 0, size: number = 10): Observable<any> {
    let params = new HttpParams().set('page', page.toString()).set('size', size.toString());
    Object.keys(filters).forEach((key) => {
      if (filters[key]) {
        params = params.set(key, filters[key]);
      }
    });
    return this.http.get(`${this.apiUrl}/admin/allUsers`, { params });
  }

  getAllRoles(): Observable<any> {
    return this.http.get(`${this.apiUrl}/admin/getAllRoles`);
  }

  

}
