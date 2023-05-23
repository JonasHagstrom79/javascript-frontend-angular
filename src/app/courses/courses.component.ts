import { Component } from '@angular/core';
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

  }
  

}
