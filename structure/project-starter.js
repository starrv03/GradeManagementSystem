import fs from 'node:fs';
// Week 1 Session 5: JavaScript Data Manipulation Project
// Student Name: [Your Name]
// Project Theme: [Choose one: Grade System, Library Catalog, Fitness Tracker, Recipe Manager, Budget Tracker]

// 1. Data Structure
// TODO: Modify this structure based on your chosen theme

/*class Record{
    constructor(id,name,course,grades,attendance,status){
        this.id=id;
        this.name=name;
        this.course=course,
        this.grades=grades;
        this.attendance=attendance;
        this.status=status;
    }
}*/

const JSON_URL="./structure/json/data.json";

let gradeSystemData={
        projectName: "Student Grade Tracker",
        records: [],
        metadata: {
            totalRecords: 0,
            lastUpdated: new Date().toISOString()
        }
    };

// 2. Core Functions

// Add a new record
export function addRecord(record) {
    fetchData();
    // TODO: Generate unique ID
    record.id=gradeSystemData.metadata.totalRecords+1;
    // TODO: Validate the record
    // TODO: Update metadata
    const result=validateRecord(record);
    // TODO: Add to projectData.records
     if(result.status){
        gradeSystemData.records.push(record);
        gradeSystemData.metadata.totalRecords++;
        gradeSystemData.metadata.lastUpdated;
        saveData();
        return {status:true, msg: record};
     } 
     return {status: false, msg: "invalid new record"};
}

// Remove a record by ID
export function removeRecord(id) {
    fetchData();
    // TODO: Find record by ID
    const records=gradeSystemData.records.filter(record=>record.id===parseInt(id));
    if(records.length<=0){
        return {status:false,msg: "record does not exist"};
    }
    const record=records[0];
    // TODO: Remove from array
    const idx=gradeSystemData.records.indexOf(record);
    const deleted=gradeSystemData.records.splice(idx,1);
    // TODO: Update metadata
    gradeSystemData.metadata.totalRecords--;
    saveData();
    return {status:true,msg:deleted};
}

// Update an existing record
export function updateRecord(id, updates) {
    fetchData();
    console.log(typeof updates);
    if(typeof updates!=="object"){
        return {status:false,msg: "updates must be an object"};
    }
    // TODO: Find record by ID
    let records=gradeSystemData.records.filter(record=>record.id===parseInt(id));
    if(records.length<=0){
        return {status:false,msg: "record does not exist"};
    }
    const record=records[0];
    //validate record
    const result=validateRecord(updates);
    // TODO: Update metadata
    if(result.status){
        // TODO: Apply updates
        for(const key in updates){
            record[key]=updates[key];
        }
        gradeSystemData.metadata.lastUpdated;
        saveData();
        return {status: true, msg: record};
    }
    return {status:false,msg: result};;
}

// Search records based on criteria
export function searchRecords(id) {
    // TODO: Filter records based on criteria
    // TODO: Return matching records
    fetchData();
    const filteredRecords=gradeSystemData.records.filter(record=>record.id===parseInt(id));
    if(filteredRecords.length<=0){
        return {status:false,msg: "record does not exist"}
    };
    return {status:true, msg: filteredRecords[0]};
}

//get records
export function getRecords(){
    fetchData();
    return gradeSystemData.records;
}

export function getProjectName(){
    fetchData();
    return gradeSystemData.projectName;
}

export function getMetadata(){
    fetchData();
    return gradeSystemData.metadata;
}

function fetchData(){
    gradeSystemData=JSON.parse(fs.readFileSync(JSON_URL,'utf-8')); 
    gradeSystemData=gradeSystemData.gradeSystemData;
}

// Calculate statistics or summary
function generateSummary() {
    // TODO: Calculate relevant statistics
    // TODO: Return summary object
    const summary=[];
    gradeSystemData.records.forEach(record=>{
        const studentSummary={};
        studentSummary.studentId=record.id;
        studentSummary.studentName=record.name;
        studentSummary.gpa=record.grades.reduce((total,value)=>total+=value,0)/record.grades.length;
        summary.push(studentSummary);
    });
    return summary;
}

// 3. Data Processing Functions

// Parse JSON string to object
function loadData(jsonString) {
    // TODO: Try to parse JSON
    // TODO: Handle errors
     let data;
     try{
        data=JSON.parse(jsonString);
     }catch(e){
        console.log(e.message);
     }
    // TODO: Validate data structure
   const result=validateRecord(data);
   if(!result.status){
        console.log(result.msg);
        return result.status;
   }
   return data;
}

// Convert object to JSON string
function saveData() {
    // TODO: Convert projectData to JSON
    // TODO: Return formatted string
    console.log("saving data....");
    const json=JSON.stringify({gradeSystemData},null,2);
    try{
        fs.writeFileSync(JSON_URL, json);
        console.log("data saved!!");
    }
    catch(error){
        console.log(error.message);
    }

}

// Validate a record before adding/updating
function validateRecord(record) {

    function isInRange(value,min,max){
        return value>=min && value<=max;
    }

    function isInRangeArr(arr,min,max){
        arr.forEach(value=>{
            if(!isInRange(value,min,max)) return false;
        });
        return true;
    }

     function isNumberArr(arr){
        arr.forEach(value=>{
            if(!typeof value==="number") return false;
        });
        return true;
    }

    // TODO: Check required fields
    // TODO: Validate data types
    // TODO: Return true/false with error message
    if(typeof record!="object") return {status:false, msg: "Record must be an object"};
    const validKeys=new Set(["id","name","course","grades","attendance","status"]);
    let status=false;
    for(const key in record){
        if(!validKeys.has(key)){
            return {status:false,msg:`${key} is an invalid key`};
        }
        else{
            if(key==="id"){
                status=typeof record[key]==="number";
                return {status,msg:status? "" : `${key} must be a number`};
            }
            else if(key==="name"){
                status=typeof record[key]==="string";
                return {status,msg:status? "" : `${key} must be a string`};
            }
            else if(key==="course"){
                status=typeof record[key]==="string";
                return {status,msg:status? "" : `${key} must be a string`};
            }      
            else if(key==="grades"){
                status=Array.isArray(record[key]) && isNumberArr(record[key]) && isInRangeArr(record[key],0,100);
                return {status,msg:status? "" : `${key} must be a list of number grades in the range 0 to 100 inclusive`};
            }   
            else if(key==="attendance"){
                status=typeof record[key]==="number" && isInRange(record[key],0,100);
                return {status,msg:status? "" : `${key} must be a number in the range 0 to 100 inclusive`};
            }  
            else{
                status=typeof record[key]==="string";
                return {status,msg:status? "" : `${key} must be a string`};
            }           
        }
    }
}

// 4. Display Functions

// Display all records
function displayRecords() {
    // TODO: Format and display records
    // TODO: Use console.log with clear formatting
    const json=JSON.stringify(gradeSystemData,null,2);
    console.log("records: ",json);
}

// Display search results
function displaySearchResults(results) {
    // TODO: Format and display search results
    // TODO: Handle case where no results found
    console.log("search results: ",results);
}

// Display summary statistics
function displaySummary(summary) {
    // TODO: Format and display summary data
    // TODO: Make numbers readable (e.g., averages, totals)
    console.log("summary",summary);

}

// 5. Main Program

function main() {
    seed();
}

function seed(){
    gradeSystemData = {
        projectName: "Student Grade Tracker",
        records: [],
        metadata: {
            totalRecords: 0,
            lastUpdated: new Date().toISOString()
        }
    };
    saveData();
    // Add records
    console.log("Adding records:");
    let newRecord={
        // Create a sample record based on your theme
            name: "Alice Johnson",
            course: "Mathematics",
            grades: [85, 92, 78, 90],
            attendance: 95,
            status: "active"
        };
    addRecord(newRecord);   
    newRecord = {
        // Create a sample record based on your theme
        name: "Samantha Simons",
        course: "Chemistry",
        grades: [75, 92, 96, 99],
        attendance: 100,
        status: "active"
    };
    addRecord(newRecord);
    newRecord = {
        // Create a sample record based on your theme
        name: "Charles Smith",
        course: "Chemistry",
        grades: [95, 92, 96, 99],
        attendance: 100,
        status: "active"
    };
    addRecord(newRecord);
}

// 6. Test Cases
// TODO: Create at least 5 test cases demonstrating your functions work correctly
function runTests() {
    console.log("\n=== Running Tests ===");

    // Test 1: Add record
    // Test 2: Remove record
    // Test 3: Update record
    // Test 4: Search records
    // Test 5: Generate summary

    console.log("=== Tests Complete ===\n");
}

function initialTest(){
     console.log("=== Student Grade Management System ===\n");

    // Initialize with sample data
    console.log("Loading initial data...");

    // Test all functionality
    console.log("\nTesting core functions...\n");

    // Test 1: Display all records
    console.log("1. Displaying all records:");
    displayRecords();
    
    // Test 2: Add a new record
    console.log("\n2. Adding a new record:");
    let newRecord = {
        // Create a sample record based on your theme
        id: 1,
        name: "Samantha Simons",
        course: "Chemistry",
        grades: [75, 92, 96, 99],
        attendance: 100,
        status: "active"
    };
    addRecord(newRecord);
    displayRecords();

    // Test 3: Search for records
    const searchId=2;
    console.log("\n3. Searching for records with id ",searchId);
    let searchResults = searchRecords(searchId);
    displaySearchResults(searchResults);

    // Test 4: Update a record
    const updateId=2;
    console.log("\n4. Updating a record with id ",updateId);
    updateRecord(updateId, { status: "inactive" });
    displayRecords();

    // Test 5: Remove a record
    const removeId=1;
    console.log("\n5. Removing a record with id ",removeId);
    removeRecord(removeId);
    displayRecords();

    // Test 6: Generate summary
    console.log("\n6. Generating summary:");
    let summary = generateSummary();
    displaySummary(summary);

    //Save data
    console.log("Saving data!!");
    saveData();
}

// Uncomment to run tests
// runTests();

// Start the program
//main();