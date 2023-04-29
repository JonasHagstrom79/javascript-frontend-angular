import { Component, OnInit } from '@angular/core';
import { BackendService } from '../backend.service';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent {
  courses: any[] = [];
  filteredCourses: any[] = [];

  constructor(private backendService: BackendService) {}

  ngOnInit(): void {
    this.backendService.getCourses().subscribe((courses) => {
      this.courses = courses;
    });
  }

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
