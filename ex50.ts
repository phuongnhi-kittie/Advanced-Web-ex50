import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, retry, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Book50Service {
  // Try direct backend URL if proxy is causing issues
  private apiUrl = 'http://localhost:3000/exercise50';

  constructor(private _http: HttpClient) { }

  // GET all books
  getBooks(): Observable<any> {
    console.log('Service: Making HTTP GET request to:', this.apiUrl);
    return this._http.get<any>(this.apiUrl).pipe(
      tap(response => {
        console.log('Service: Raw response received:', response);
        console.log('Service: Response type:', typeof response);
      }),
      retry(3),
      catchError((error) => {
        console.error('Service: HTTP Error details:', {
          message: error.message,
          status: error.status,
          statusText: error.statusText,
          url: error.url,
          error: error.error
        });
        return this.handleError(error);
      })
    );
  }

  // GET book by id
  getBookById(id: number): Observable<any> {
    return this._http.get<any>(`${this.apiUrl}/${id}`).pipe(
      retry(3),
      catchError(this.handleError)
    );
  }

  // POST create book
  createBook(formData: FormData): Observable<any> {
    return this._http.post<any>(this.apiUrl, formData).pipe(
      catchError(this.handleError)
    );
  }

  // PUT update book
  updateBook(id: number, formData: FormData): Observable<any> {
    return this._http.put<any>(`${this.apiUrl}/${id}`, formData).pipe(
      catchError(this.handleError)
    );
  }

  // DELETE book
  deleteBook(id: number): Observable<any> {
    return this._http.delete<any>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    return throwError(() => new Error(error.message));
  }
}
