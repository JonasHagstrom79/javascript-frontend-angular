import { Atlas } from './atlas.js';
import { RESTDataSource } from './rest-data-source.js';

/** The data source for our Atlas */
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
	console.log(grades); //TODO:remove

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
		selectElement.addEventListener('change', updateMyCourse);

	 	td.appendChild(selectElement);
	 	tr.appendChild(td);

		// Add delete-button to the row
		const _td = document.createElement('td');
		const btnDelete = document.createElement('button');
		btnDelete.innerText = 'Radera';
		btnDelete.courseCode = course.courseCode;
		btnDelete.addEventListener('click', deleteMyCourse, false);
		_td.appendChild(btnDelete);
		tr.appendChild(_td);
		
	 	// Add the row to the table
	 	table.appendChild(tr);
		
	});

	console.log(grades); //TODO:REmove!	
	const select = document.getElementById('newMyCourseSelect');
	console.log("Utanför");
	console.log(select); //Skriver ut alla options	
	//createGradeOptions(select, grades, ); // TODO: får inte in grade

	// click event to submit button in the form
	if (currentPage.toLocaleLowerCase() == MY_COURSES_PAGE.toLocaleLowerCase()) {
		document.querySelector('#newMyCourseSubmit').addEventListener('click', addNewMyCourse);
	}

	// });
	// courses.forEach(async course => {
    //     // Make a table row
    //     const tr = document.createElement("tr");

    //     // Populate the row with the data to display
    //     createTd(course.courseCode, tr);
    //     createTd(course.name, tr);
    //     createTd(course.subject, tr);
    //     createTd(course.progression, tr);
    //     createTd(course.points, tr);
    //     createTd(course.institutionCode, tr,
    //         element => element.classList.add("center"));

    //     // Add the row to the table
    //     table.appendChild(tr);
    // });
}

/**
 * Adds a new course to myCourses
 */
async function addNewMyCourse() {
	//
	const form = document.querySelector('#newMyCourse');
	const formBody = new FormData(form);
	
	const addcourse = await atlas.addMyCourse(formBody.get('courseCode'), formBody.get('grade')).then(res => res.json());
	console.log(addcourse);
	courses.push(addcourse); // HÄR!

	//update the ui soehow maybe?
	updateUI();
	form.reset();
}

/**
 *  Updates a course
 */
async function updateMyCourse(e) {
	console.log('ABC');
	console.log(e); // Skriver ut #select_KURSKOD
	//console.log(courseCode);
	const testar = e.curretTarget.getAttribute("id");
	console.log(testar);
	const courseCode = e.curretTarget.getAttribute('id').split('_')[1]; //TODO:Här fungerar ej!!! VAD har du som id?
	//const c = e.curretTarget.getAttribute('id').split('_')[1];
	
	const updateMyCourse = await atlas.updateMyCourse(courseCode, e.curretTarget.value).then(res => res.json());
	const updateMyCourseIndex = courses.findIndex(obj => obj.courseCode == courseCode);
	// Updates the course
	courses[updateMyCourseIndex] = updateMyCourse;

}

/**
 * Deletes a course
 */
async function deleteMyCourse(e) {
	console.log(e);
	console.log("deleteMyCourse");
	console.log(e.curretTarget);
	const deletedMyCourse = await atlas.deleteMyCourse(e.curretTarget.courseCode).then(res => res.json());
	courses = courses.filter(obj => {
		return obj.courseCode.toLocaleLowerCase() !== deletedMyCourse.courseCode.toLocaleLowerCase();
	})

	updateUI();
	//maybe update the ui?
}

function updateUI() {

	const table = document.getElementById("courses_table");
	table.innerHTML = null;
	createTableForMyCourses(courses, table);
}


/**
* Create option elements for the specified select element.
* @param selectElement the select element to create and add option elements for
* @param grades an array of grades to create option elements for
* @param selectedGrade the grade to be the selected option in the selectElement
*/
function createGradeOptions(selectElement, grades, selectedGrade) {
	
	// Create the td to hold the select element
	const td = document.createElement("td");
		
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
	console.log(selectElement); //TODO: reove!
	// Add selectElement to td
	td.appendChild(selectElement);

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

// async function updateMyCourse() {

// }

// async function deleteMyCourse() {

// }
// atlas.addMyCourse("dtw00", "A")

// window.onload = gradeoptTest();
// function gradeoptTest() {
// 	$.getJSON("http://localhost:3000/api/grades", function(data) {
// 		var options = data;
// 		console.log(data);
// 		$('#select').empty();
// 		$.each(options, function(i, p) {
//     		$('#select').append($('<option></option>').val(p).html(p));
// 			//return i; // Testar här
			
// 		});		
		
// 	});
	
// 	//console.log(i);
	
// }

function testR() {

}

function myfunction() {

	document.write("welcome to Javatpoint");
}



document.addEventListener('DOMContentLoaded', starterFunction);
