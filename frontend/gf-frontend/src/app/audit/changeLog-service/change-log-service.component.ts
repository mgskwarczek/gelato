import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ChangeRecord } from '../../../users/interfaces/user-model';

@Injectable({
  providedIn: 'root',
})
export class ChangeLogService {
  private apiChangesUrl = 'http://localhost:8080/auditLog/getChanges?id=';

  constructor(private http: HttpClient) {}

  getChanges(entityId: number, entityName: string): Observable<ChangeRecord[]> {
    let requestUrl =
      this.apiChangesUrl + entityId + '&entityName=' + entityName;
    console.log(requestUrl);
    return this.http.get<any>(requestUrl).pipe(
      map((response) => {
        return response.map((item: ChangeRecord) => ({
          ...item,
          changeDate: new Date(item.changeDate),
        }));
      }),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Network error: ${error.error.message}`;
    } else {
      errorMessage = `Server error: Code ${error.status}, Message: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
