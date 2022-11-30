import { DataSource } from "./data-source.js";

//const serverURL = "http://localhost:3000"; //TODO:remove!

/**
 * This class represents a data source where a REST API is used 
 * to get data from.
 * @extends DataSource
 */
export class RESTDataSource extends DataSource {
	/**
	 * Create a new data source with the specified JSON file as its source of data.
	 * @param url the name of the JSON file to be used as source of data
	 */
	constructor(url) {
		super(url);
	}

	/**
	 * Get data from the specified endpoint.
	 * @param endpoint default an empty string ''
	 * @param method default GET
	 * @param body default an empty body {}
	 * @return a Promise that resolves to the value of the given endpoint
	 */
	 async getData(endpoint = '', method = 'GET', body = {}) {
		return super.getData(endpoint, method, body);
		
	}

    /**
	* Get all Miun courses from the REST API.
	* @return a Promise that resolves to an array of courses
	*/
	async getCourses() {

		return this.getData('/api/courses');

	}

	/**
	* Get the Miun course with the specified course code from the REST API.
	* @param courseCode the course code of the course to get
	* @return a Promise that resolves to a course object or {} if the course doesn't exist
	*/
	async getCourse(courseCode) {		
		
		return this.getData('/api/courses' + courseCode)

	}

	/**
	* Get all My courses from the REST API.
	* @return a Promise that resolves to an array of My courses (a Miun course with grade included)
	*/
	async getMyCourses() {
		
		return this.getData('/api/courses/my');
		
	}

	/**
	* Get the My course with the specified course code from the REST API.
	* @param courseCode the course code of the course to get
	* @return a Promise that resolves to a My course object or {} if the course doesn't exist
	*/
	async getMyCourse(courseCode) {		

		return this.getData('/api/courses/my/:'+courseCode);
		
	}

	/**
	* Add a My course with a grade to the REST API.
	* @param courseCode the course code for the course to be added
	* @param grade the student's grade in the course being added
	* @return a Promise that resolves to a My course object of the course added or an error 
	*         message explaining why the course couldn't be added
	*/
	async addMyCourse(courseCode, grade) {
		
		return this.getData('/api/courses/my', 'POST', 
		{'courseCode': courseCode, 'grade': grade});

	}	

	/**
	* Delete a My course from the REST API.
	* @param courseCode the course code for the course to be deleted
	* @return a Promise that resolves to the My course deleted or an error 
	*         message explaining why the course couldn't be deleted
	*/
	async deleteMyCourse(courseCode) {
		
		return this.getData('/api/courses/my/' + courseCode, 'DELETE');
		
	}

	/**
	* Update the grade for a My course in the REST API.
	* @param courseCode the course code of the My course to update the grade for
	* @param grade the new grade
	* @return a Promise that resolves to the My course updated or an error 
	*         message explaining why the course's grade couldn't be updated
	*/
	updateMyCourse(courseCode, grade) {
		// TODO: In lab 1, implement according to requirements
		//throw Error("Not implemented!");
		return this.getData('/api/courses/my/' +courseCode, 'PUT',
		{'courseCode': courseCode, 'grade': grade});
	}

	/**
	* Get all grades in the grade scale from the REST API.
	* @return a Promise that resolves to an array of grades
	*/
	async getGrades() {
		// TODO: In lab 1, implement according to requirements
		return this.getData('/api/grades')
	}
}
