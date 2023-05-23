import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
//import { HomeComponent } from './app.component'; //TODO:remove?
import { CoursesComponent } from './courses/courses.component';
import { MyCoursesComponent } from './my-courses/my-courses.component';
import { MyCoursesRoutingModule } from './my-courses/my-courses-routing.module';//TODO:remove?


const routes: Routes = [
  { path: '', component: CoursesComponent},
  { path: 'courses', component: CoursesComponent },
  { path: 'mycourses', component: MyCoursesComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
