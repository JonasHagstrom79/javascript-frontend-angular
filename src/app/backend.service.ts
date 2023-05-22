import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MyCourse } from './my-course';

@Injectable({
  providedIn: 'root'
})
export class BackendService {
  private apiUrl = "http://localhost:3000/api"; 

  constructor(private http: HttpClient) { }

  // Get courses
  getCourses(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/courses`);
  }
  
  // Get my courses
  getMyCourses(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/courses/my`);
  }

  //updateMyCourses( mycourses: any[]): Observable<any> {
  //  return this.http.put<any>(`${this.apiUrl}/courses/my`, mycourses);
  //}

  // Get grades
  getGrades(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/grades`);
  }
  /*
  updateMyCourse(courseCode: string, updatedCourse: MyCourse): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/courses/my/${courseCode}`, updatedCourse);
  }*/

  updateMyCourse(courseCode: string, updatedCourse: MyCourse): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/courses/my/${courseCode}`, updatedCourse);
  }

  deleteMyCourse(courseCode: string, deletetdCourse: MyCourse): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/courses/my/${courseCode}`, {body:deletetdCourse});
  }
  // Adds a course to my courses
  addCourse(newCourse: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/courses/my`, newCourse);
  }
}
