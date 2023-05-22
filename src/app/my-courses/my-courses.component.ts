import { Component, OnInit } from '@angular/core';
import { Course } from '../course'; //TODO:remove?
import { MyCourse } from '../my-course';
import { BackendService } from '../backend.service';

@Component({
  selector: 'app-my-courses',
  templateUrl: './my-courses.component.html',
  styleUrls: ['./my-courses.component.css']
})
export class MyCoursesComponent implements OnInit{
  mycourses: MyCourse[] = [];
  filteredMyCourses: MyCourse[] = [];
  showAllMyCourses: boolean = true;
  grades: string[] = [];

  constructor(private backendService: BackendService) {}

  /**
   * Initializes the component and fetches courses and grades from the backend service
   */
  ngOnInit(): void {
    // Fetch mycourses from backend service during component initialization    
    this.getMyCourses();
    this.getGrades();    
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
    console.log("Search term received2:", searchTerm);//TODO:Remove!
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
  console.log("Filtered courses2:", this.filteredMyCourses); //TODO:Remove!
  }

  /**
   * Searches for Mycourses based on the search term
   * @param searchTerm - course code or name
   */
  onSearch(searchTerm: string): void {
    // Logic to filter Mycourses based on the search term
    console.log("Search term from onSearch(my-courses.components):", searchTerm);
    const searchString = searchTerm.toLowerCase();
    this.filteredMyCourses = this.mycourses.filter(mycourse => this.searchFilter(mycourse, searchString));  
    console.log("Filtered courses from onSearch(my-courses.components):", this.filteredMyCourses);
  }

  /**
   * Filters the course based on the search string
   * @param mycourse - The course to be filtered
   * @param searchString - The search string
   * @returns - A boolean indicating whether the course matches the search criteria
   */
  searchFilter(mycourse: { courseCode: string; name: string; }, searchString: string): boolean {
    // Combines the course code and name into a single string (haystack) for searching
    const haystack = (
      mycourse.courseCode + "|" +
      mycourse.name
    ).toLowerCase();
    // Checks if the haystack includes the search string
    // Returns true if the search string is empty or if the haystack includes the search string
    return searchString == '' || haystack.includes(searchString);
  }
  
  /**
   * Removes a course from mycourses array and updates the backend
   * @param mycourse - The course to be removed
   */
  
  removeCourse(mycourse: MyCourse, courseCode: string): void {
   // Find the index of the course in the mycourses array
  const index = this.mycourses.indexOf(mycourse);
  if (index !== -1) {
    // Remove the course from the mycourses array
    this.mycourses.splice(index, 1);
    // Update the backend with the modified mycourses array
    this.backendService.updateMyCourse(courseCode, mycourse).subscribe(
      () => {
        console.log("Course removed successfully");
      },
      (error: any) => {
        console.error("Failed to remove course:", error);
        // Optionally, you can handle error cases
      }
    );
  }
}

/*
updateGrade(mycourse: MyCourse): void {
  console.log(mycourse.grade)
  this.backendService.updateMyCourses(this.mycourses).subscribe(
    () => {
      console.log("Grade updated successfully");
    },
    (error: any) => {
      console.error("Failed to update grade:", error);
    }
  );
}*/

editGrade(mycourse: MyCourse): void {
  //const newGrade = prompt("Ange det nya betyget:");

  //if (newGrade !== null) {
  //  // Uppdatera betyget för mycourse
  //  mycourse.grade = newGrade;

    // Anropa BackendService för att uppdatera betyget på servern
    this.backendService.updateMyCourse(mycourse.courseCode, mycourse).subscribe(
      () => {
        console.log("Grade updated successfully");
      },
      error => {
        console.error("Failed to update grade:", error);
        // Hantera eventuella fel
      }
    );
  }
}


  /*
  onSearch(searchTerm: string): void {
    // Logik för att filtrera kurser baserat på söktermen
    const searchString = searchTerm.toLowerCase();
    this.filteredMyCourses = this.mycourses.filter(mycourse => this.searchFilter(mycourse, searchString));
  }

  searchFilter(course: { courseCode: string; name: string; }, searchString: string): boolean {
    const haystack = (
      course.courseCode + "|" +
      course.name
    ).toLowerCase();
  
    return searchString == '' || haystack.includes(searchString);
  }
*/

