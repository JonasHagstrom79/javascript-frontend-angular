import { Component, OnInit } from '@angular/core';
import { BackendService } from '../backend.service';

@Component({
  selector: 'app-add-my-course',
  templateUrl: './add-my-course.component.html',
  styleUrls: ['./add-my-course.component.css']
})
export class AddMyCourseComponent implements OnInit {
  courseCode: string = '';
  grades: string[] = [];
  selectedGrade: string = '';

  constructor(private backendService: BackendService) { }

  ngOnInit(): void {
    this.getGrades();
  }

  //async getGrades(): Promise<void> {
  //  this.grades = await this.backendService.getGrades();
  //}

  getGrades(): void {
    this.backendService.getGrades().subscribe(grades => {
      this.grades = grades;
    });
  }

  async addCourse(): Promise<void> {
    // Skicka den nya kursen till BackendService för att lagra den
    const newCourse = {
      courseCode: this.courseCode,
      grade: this.selectedGrade
    };

    await this.backendService.addCourse(newCourse).toPromise();
  }

}
