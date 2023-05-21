import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-search-course',
  templateUrl: './search-course.component.html',
  styleUrls: ['./search-course.component.css']
})
/*
export class SearchCourseComponent implements OnInit{
  @Output() search = new EventEmitter<string>();
  searchTerm: string | undefined;

  constructor() { }

  ngOnInit(): void { }

  onSearch(): void {
    this.search.emit(this.searchTerm);
  }*/
  export class SearchCourseComponent {
    @Output() searchQuery = new EventEmitter<string>();
  
    searchTerm: string | undefined;

    onSearch(): void {
    this.searchQuery.emit(this.searchTerm);
  }
}
