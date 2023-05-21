import { Component } from '@angular/core';
import { Course } from '../course';

@Component({
  selector: 'app-my-courses',
  templateUrl: './my-courses.component.html',
  styleUrls: ['./my-courses.component.css']
})
export class MyCoursesComponent {
  courses: any[] = [];
  filteredCourses: Course[] = [];
  showAllCourses: boolean = true;

  onSearch(searchTerm: string): void {
    // Logik för att filtrera kurser baserat på söktermen
    const searchString = searchTerm.toLowerCase();
    this.filteredCourses = this.courses.filter(course => this.searchFilter(course, searchString));
  }

  searchFilter(course: { courseCode: string; name: string; }, searchString: string): boolean {
    const haystack = (
      course.courseCode + "|" +
      course.name
    ).toLowerCase();
  
    return searchString == '' || haystack.includes(searchString);
  }

}
