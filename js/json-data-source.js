import { DataSource } from "./data-source.js";

/**
 * This class represents a data source where a JSON file is used 
 * to get data from.
 * @extends DataSource
 */
export class JSONDataSource extends DataSource {
	/**
	 * Create a new data source with the specified JSON file as its source of data.
	 * @param file the name of the JSON file to be used as source of data
	 */
	constructor(file) {
		super(file);
	}

	/**
	 * Get all data from the JSON file. It is the calling 
	 * method's responsibility to search out the requested data.
	 * @param endpoint default an empty string ''
	 * @param method default GET
	 * @param body default an empty body {}
	 * @return a Promise that resolves to the value of the given endpoint
	 */
	 async getData(endpoint = '', method = 'GET', body = {}) {
		return super.getData(endpoint, method, body)
		.then(response => {
			// For a JSON data source, we are concerned about the 404 (Not Found) 
			// response status code, which means the JSON file was not found (this
			// will not be the case when using eg. a REST API).
			if (response.status == 404) {
				// Throw an error with a message to immediately reject the promise 
				throw Error("The JSON data source was not found!");
			}

			// For a JSON data source, we are not interested in status codes,
			// so we return the response body as JSON.
			return response.json();
		});
	}

    /**
	* Get all Miun courses from the JSON file.
	* @return a Promise that resolves to an array of courses
	*/
	async getCourses() {
		return this.getData()
		.then(json => json.courses); // only return the array with Miun courses from the json
	}

	/**
	* Get the Miun course with the specified course code from the JSON file.
	* @param courseCode the course code of the course to get
	* @return a Promise that resolves to a course object or {} if the course doesn't exist
	*/
	async getCourse(courseCode) {
		return this.getCourses()
		.then(courses => courses.find(
			course => course.courseCode.toLowerCase() === courseCode.toLowerCase() // return where course code match
		) || {}); // or return {} if no course with that course code exists
	}

	/**
	* Get all My courses from the data source.
	* @return a Promise that resolves to an array of My courses (a Miun course with grade included)
	*/
	async getMyCourses() {
		
		let myCourses = await this.getData()
		.then(json => json.myCourses);
		

		for (let course of myCourses) {
			
			this.#setCourseData(course)
			console.log(course) 
		}

		return myCourses
		
	}

	/**
	* Get the My course with the specified course code from the JSON file.
	* @param courseCode the course code of the course to get
	* @return a Promise that resolves to a My course object or {} if the course doesn't exist
	*/
	async getMyCourse(courseCode) {
		// TODO: In lab 0, implement according to requirements
		return this.getCourse()
		.then(myCourses => myCourses.find(
			course => course.courseCode.toLowerCase() === courseCode.toLowerCase()
		) || {});
		
	}

	/**
	* Add a My course with a grade to the JSON file.
	* @param courseCode the course code for the course to be added
	* @param grade the student's grade in the course being added
	* @return a Promise that resolves to a My course object of the course added or an error 
	*         message explaining why the course couldn't be added
	*/
	async addMyCourse(courseCode, grade) {
		// WILL NOT BE USED
		throw Error("Not implemented!");
	}

	/**
	* Delete a My course from the JSON file.
	* @param courseCode the course code for the course to be deleted
	* @return a Promise that resolves to the My course deleted or an error 
	*         message explaining why the course couldn't be deleted
	*/
	async deleteMyCourse(courseCode) {
		// WILL NOT BE USED
		throw Error("Not implemented!");
	}

	/**
	* Update the grade for a My course in the JSON file.
	* @param courseCode the course code of the My course to update the grade for
	* @param grade the new grade
	* @return a Promise that resolves to the My course updated or an error 
	*         message explaining why the course's grade couldn't be updated
	*/
	updateMyCourse(courseCode, grade) {
		// WILL NOT BE USED
		throw Error("Not implemented!");
	}

	/**
	* Get all grades in the grade scale from the JSON file.
	* @return a Promise that resolves to an array of grades
	*/
	async getGrades() {
		return this.getData()
		.then(json => json.grades); // only return the array with grades from the json
	}

	
	/**
	* Helper method for Lab 0.
	* Assign data from corresponding Miun course to all My courses.
	* @param myCourses an array of My courses
	* @return an array of My courses with Miun course data
	*/
	async #addCourseData(myCourses) {
		// Use Promise.all() in order to wait for the resolval of all promises from using map
		return Promise.all(myCourses.map(myCourse => this.#setCourseData(myCourse)));
	}

	/**
	* Helper method for Lab 0.
	* Assign data from corresponding Miun course the My course.
	* @param myCourses the My course to assign course data to
	* @return a My course with all data from the corresponding Miun course
	*/
	async #setCourseData(myCourse) {
		const miunCourse = await this.getCourse(myCourse.courseCode);
		return Object.assign(myCourse, miunCourse);
	}
}
