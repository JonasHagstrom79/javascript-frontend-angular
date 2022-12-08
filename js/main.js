import { Atlas } from './atlas.js';
import { RESTDataSource } from './rest-data-source.js';

/** The data source for our Atlas */
//const dataSource = new RESTDataSource("https://caha1906-lab1-backend-dt190g.azurewebsites.net/");
const dataSource = new RESTDataSource("http://localhost:3000");

/** The Atlas instance */
const atlas = new Atlas(dataSource);

/** The name of the page displaying the list of My courses */
const MY_COURSES_PAGE = "my-courses.html";

/** The name of the page curretly beeing displayed */
let currentPage = "index.html";

/** An array of all courses to list on the page. It can be Miun 
 * courses or My courses depending on the current page. */
let courses = [];

/** Limit the number of courses to show on the page.
 * A search will search among all courses in the list.
 */
const limit = 100;

/** Compare two course codes (can be used when sorting a list of courses) */
const courseCodeDescending = (a, b) => a.courseCode > b.courseCode ? 1 : -1;

/** A filter that returns true for courses whose course code or name contains the searched string */
const searchFilter = (course, searchString) => {
	// Search in course code and course name
	const haystack = (
		course.courseCode + "|" + 
		course.name
		).toLowerCase();

	// return false if nothing to search for or if the searched string is found or not
	return searchString == '' || haystack.includes(searchString);
};

/**
 * Handles initialization of the app.
 */
function starterFunction() {
	// Get the name of the current page
	currentPage = window.location.pathname.split("/").find(str => str.includes(".html"));

	// Call searchCourses function on keyup events from the search text input
	document.getElementById("search").addEventListener("keyup", searchCourses);
	
	// Get the list of courses from Atlas
	const coursesPromise = currentPage == MY_COURSES_PAGE ? atlas.getMyCourses() : atlas.getCourses();
	console.log(coursesPromise) //TODO:remove
	coursesPromise
	.then(async fetchedCourses => {
		courses = await fetchedCourses.json();
		console.log(courses)
		//console.log(courses[0]) //TODO: remove
		createTable(); // create the table with the fetched courses
	})
	.catch(error => console.error(`An error occurd when getting courses from Atlas: ${error}`));
}

/**
* Creates the HTML table displaying the courses (either Miun courses or My courses).
*/
function createTable() {
	// The type of course (a Miun course or a My course) to be listed in the table depends
	// on the name of the current location (name of the page). The structure of the table 
	// displaying course data also depends upon this.

	// Descide the function to be used when creaing the HTML tabel
	const tableCreator = currentPage == MY_COURSES_PAGE ? createTableForMyCourses : createTableForMiunCourses;

	// Regardles the type of table to create, sort and filter the courses
	const searchString = document.getElementById("search").value.toLowerCase();

	// Keep the original course array intact by assigning the filterad courses to a new array
	let coursesToList = courses.filter(course => searchFilter(course, searchString));
	coursesToList = coursesToList.sort(courseCodeDescending).slice(0, limit); // limit the number of courses to display

	// Clear any existing data in the table
	const table = document.getElementById("courses_table");
	table.innerHTML = null;
	
	// Create the table 
	// (a call to createTableForMyCourses(courses, table) or createTableForMiunCourses(courses, table))
	tableCreator(coursesToList, table);
}

/**
* Create table rows for all Miun courses in the array.
* @param courses an array of Miun courses to create table rows for
* @param table the table or the table body to add the rows to
*/
function createTableForMiunCourses(courses, table) {
	// For each course create a table row with course data
	courses.forEach(course => {
		// Make a table row
		const tr = document.createElement("tr");

		// Populate the row with the data to display
		createTd(course.courseCode, tr);
		createTd(course.name, tr);		
		createTd(course.subjectCode, tr)
		createTd(course.progression, tr);
		createTd(course.points, tr);
		createTd(course.institutionCode, tr,
			element => element.classList.add("center"));

		// Add the row to the table
		table.appendChild(tr);
	});
}

/**
* Create table rows for all My courses in the array.
* @param courses an array of My courses to create table rows for
* @param table the table or the table body to add the rows to
*/
async function createTableForMyCourses(courses, table) {
	// Get grades from Atlas and then create the table
	const grades = await atlas.getGrades().then(grades => grades.json())
	
	// For each My course create a table row with course data
	courses.forEach(course => {
		// Make a table row
		const tr = document.createElement("tr");

		// Populate the row with the data to display
		createTd(course.courseCode, tr);
		createTd(course.name, tr);
			
		// Create a td to hold the select element for selecting grade
		const td = document.createElement("td");
		td.classList.add("center");

		// Create a select element for the grades that can be selected
		const selectElement = document.createElement("select");
		selectElement.id = "select_" + course.courseCode;
			
		// Add each grade as an option in the select element and set
		// the course grade as the selected grade in the list
		createGradeOptions(selectElement, grades, course.grade);
		
		// Eventlistenser to select option		
		selectElement.addEventListener('change', _event => updateMyCourse(course.courseCode));

		td.appendChild(selectElement);
		tr.appendChild(td);

		// Add delete-button to the row
		const _td = document.createElement('td');
		const btnDelete = document.createElement('button');
		btnDelete.innerText = 'Radera';
		btnDelete.courseCode = course.courseCode;
		// Add listener to the button
		btnDelete.addEventListener('click', _event => deleteMyCourse(course.courseCode));
		_td.appendChild(btnDelete);
		tr.appendChild(_td);

		// Add the row to the table
		table.appendChild(tr);		
		
	});

	// Creates gradeoptions for (to be)added course	
	const select = document.getElementById('newMyCourseSelect');	
	createGradeOptions(select, grades, grades); 

	// Click event to submit button in the form
	if (currentPage.toLocaleLowerCase() == MY_COURSES_PAGE.toLocaleLowerCase()) {

		document.querySelector('#newMyCourseSubmit').addEventListener('click', addNewMyCourse);

	};
	
}

/**
 * Adds a new course to myCourses
 */
async function addNewMyCourse() {
	
	// Gets the data fron the html-form
	const form = document.querySelector('#newMyCourse');
	const formBody = new FormData(form);
	
	await atlas.addMyCourse(formBody.get('courseCode'), formBody.get('grade')).then(res => res.json());
	
	// Refreshes the page
	location.reload();
	form.reset();	
}

/**
 *  Updates a course grade with selected grade
 */
async function updateMyCourse(e) {

	// Gets the coursecode 
	const code = e

	// Gets the grade
	const grade = document.getElementById(`select_`+code); //NYTT2022-11-29
	
	// Gets the value from select element select option
	const value = grade.value	

	// Upddates course grade
	const updateMyCourse = await atlas.updateMyCourse(e, value).then(res => res.json());
	const updateMyCourseIndex = courses.findIndex(obj => obj.courseCode == e); 
	
	courses[updateMyCourseIndex] = updateMyCourse;

}

/**
 * Deletes a course
 */
async function deleteMyCourse(e) {
	
	// Deletes the course from the event e
	const deletedMyCourse = await atlas.deleteMyCourse(e).then(res => res.json());
	
	// Returns the courses
	const result = courses.filter(course => course.courseCode !== deletedMyCourse.courseCode);
	
	// Refreshes the page
	location.reload();
	
	return result;	
}

/**
* Create option elements for the specified select element.
* @param selectElement the select element to create and add option elements for
* @param grades an array of grades to create option elements for
* @param selectedGrade the grade to be the selected option in the selectElement
*/
function createGradeOptions(selectElement, grades, selectedGrade) {
				
	// For each grade 
	for(let grade of grades) {
		
		// Create an option element
		const option = document.createElement("option");
		
		// Add the text of the grade to the option
		option.innerText = grade.toUpperCase();
		
		// Add the option the selectElement
		selectElement.appendChild(option)
		
	}	

	// Set selectedGrade from myCourses
	selectElement.value = selectedGrade	
	
}

/**
* Create a data cell (td element) with the specified text
* @param text the text to to be displayed in the data cell
* @param tr the table row to add the data cell to
* @param extra a lambda that handles any extra that needs to be added to the data cell
*/
function createTd(text, tr, extra) {
	const td = document.createElement("td");
	td.innerText = text;
	
	if (extra) {
		extra(td);
	}

	tr.appendChild(td);
}

/**
 * Perform a search for courses matching the text entered in the search input.
 */
function searchCourses() {
	// A re-creation of the table will filter out the courses not matching the searched value
	createTable();
}

document.addEventListener('DOMContentLoaded', starterFunction);
