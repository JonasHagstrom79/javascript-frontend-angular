import { Component, OnInit } from '@angular/core';
import { MyCourse } from '../my-course';
import { BackendService } from '../backend.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-my-courses',
  templateUrl: './my-courses.component.html',
  styleUrls: ['./my-courses.component.css'], 
})

export class MyCoursesComponent implements OnInit{
  mycourses: MyCourse[] = [];
  filteredMyCourses: MyCourse[] = [];
  showAllMyCourses: boolean = true;
  grades: string[] = [];
  selectedGrade: string = "";

  constructor(private backendService: BackendService, private changeDetectorRef: ChangeDetectorRef) {}

  /**
   * Initializes the component and fetches courses and grades from the backend service
   */
  ngOnInit(): void {
    // Fetch mycourses from backend service during component initialization    
    this.getMyCourses();
    this.getGrades();    
  }

  // Displays the child component
  onCourseAdded(): void {  
  }

  /**
   * Fetches mycourses from the backend service
   */
  getMyCourses(): void {
    this.backendService.getMyCourses().subscribe(mycourses => {
      this.mycourses = mycourses;
    });
  }

  /**
   * Fetches grades from the backend service
   */
  getGrades(): void {
    this.backendService.getGrades().subscribe(grades => {
      this.grades = grades;
    });
  }

  /**
   * Filters the myCourses array based on the search term
   * @param searchTerm - The search term to filter the myCourses array
   */
  onSearchQueryReceived(searchTerm: string) {
    
    if (searchTerm && searchTerm.trim() !== '') {
      // Filter courses based on the search term
      this.filteredMyCourses = this.mycourses.filter(mycourse =>
        (mycourse.courseCode && mycourse.courseCode.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (mycourse.name && mycourse.name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      this.showAllMyCourses = false;
  } else {
    // If search term is empty, show all courses
      this.filteredMyCourses = this.mycourses;
      this.showAllMyCourses = true;
    }
    
  }  

/**
 * Updates the grade for a course and updates the backend
 */
async editGrade(mycourse: MyCourse): Promise<void> {
 
    // Call BackendService to update the grade on the server
    try {
      // Await the completion of the update operation
      await this.backendService.updateMyCourse(mycourse.courseCode, mycourse).toPromise();
      
    } catch (error) {
      console.error("Failed to update grade:", error);
      
    }
    
  }

/**
 * Removes a course from mycourses array and updates the backend
 */
async deleteMyCourse(courseCode: string, mycourse: MyCourse): Promise<any> {
  try {
    // Call BackendService to remove the course from server
    await this.backendService.deleteMyCourse(courseCode, mycourse).toPromise();

    // Update courses in UI or bindings
    this.mycourses = this.mycourses.filter((course) => course.courseCode !== mycourse.courseCode);

    console.log("Course removed successfully");

  } catch (error) {
    console.error("Failed to remove course:", error);
  }

}
  
}
