import { Component, OnInit } from '@angular/core';
import { Course } from '../course';
import { SearchCourseComponent } from '../search-course/search-course.component';

import { BackendService } from '../backend.service';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css'],
  
})
export class CoursesComponent {
  courses: any[] = [];
  filteredCourses: any[] = []; 
  showAllCourses: boolean = true;
  

  constructor(private backendService: BackendService) {}

  /**
   * Initializes the component and fetches courses from the backend service
   */
  ngOnInit(): void {
    // Fetch courses from backend service during component initialization
    this.backendService.getCourses().subscribe((courses) => {
      this.courses = courses;
    });
  }

  /**
   * Filters the courses array based on the search term
   * @param searchTerm 
   */
  onSearchQueryReceived(searchTerm: string) {
    console.log("Search term received2:", searchTerm);//TODO:Remove!
  if (searchTerm && searchTerm.trim() !== '') {
    // Filter courses based on the search term
    this.filteredCourses = this.courses.filter(course =>
      (course.courseCode && course.courseCode.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (course.name && course.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    this.showAllCourses = false;
  } else {
    // If search term is empty, show all courses
    this.filteredCourses = this.courses;
    this.showAllCourses = true;
  }
  console.log("Filtered courses2:", this.filteredCourses); //TODO:Remove!

  }

  /**
   * Searches for courses based on the search term
   * @param searchTerm - course code or name
   */
  onSearch(searchTerm: string): void {
    // Logik för att filtrera kurser baserat på söktermen
    console.log("Search term from onSearch(courses.components):", searchTerm);
    const searchString = searchTerm.toLowerCase();
    this.filteredCourses = this.courses.filter(course => this.searchFilter(course, searchString));
    console.log("Filtered courses from onSearch(courses.components):", this.filteredCourses);
  }

  /**
   * Filters the course based on the search string
   * @param course - The course to be filtered
   * @param searchString - The search string
   * @returns - A boolean indicating whether the course matches the search criteria
   */
  searchFilter(course: { courseCode: string; name: string; }, searchString: string): boolean {
    // Combines the course code and name into a single string (haystack) for searching
    const haystack = (
      course.courseCode + "|" +
      course.name
    ).toLowerCase();
    // Checks if the haystack includes the search string
    // Returns true if the search string is empty or if the haystack includes the search string
    return searchString == '' || haystack.includes(searchString);
  }
}
