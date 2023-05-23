import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { BackendService } from '../backend.service';
import { Router } from '@angular/router';
import { MyCourse } from '../my-course';

@Component({
  selector: 'app-add-my-course',
  templateUrl: './add-my-course.component.html',
  styleUrls: ['./add-my-course.component.css']
})
export class AddMyCourseComponent implements OnInit {
  courseCode: string = '';
  errorMessage: string = '';
  myCourses: MyCourse[] = [];
  grades: string[] = [];
  selectedGrade: string = '';

  constructor(private backendService: BackendService) { }

  ngOnInit(): void {
    this.getGrades();
  }

  @Output() courseAdded: EventEmitter<any> = new EventEmitter<any>();

  /**
   * Fetches grades from the backend service
   */
  getGrades(): void {
    this.backendService.getGrades().subscribe(grades => {
      this.grades = grades;
    });
  }

  /**
   * Adds a course to my courses
   */
  async addCourse(): Promise<void> {
    
    // Chact that both courseCode and grade are filled in
    if (!this.courseCode || !this.selectedGrade) {
      this.errorMessage = 'Du måste fylla i både kurskod och betyg.';
      return;
    };
    
    // Check that the course code is valid
    if (this.myCourses.some(myCourse => myCourse.courseCode === this.courseCode)) {
      this.errorMessage = "Kursen finns redan i mina kurser.";
      return;
    }
    
    
    const newCourse = {
      courseCode: this.courseCode.toLocaleUpperCase(),
      grade: this.selectedGrade
    };

    try {
      // Send the course to the backend
      await this.backendService.addCourse(newCourse).toPromise();
      
      
      // Reload the page to update the list of courses
      location.reload();
      
      // Display eror message
    } catch (error: any) {
      if (error.error && error.error.error) {
        this.errorMessage = error.error.error;
      } else {
        this.errorMessage = 'Ett fel uppstod. Försök igen senare.';
      }
    }
    
  };



}
