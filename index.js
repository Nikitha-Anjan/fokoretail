const csv = require('csv-parser')
const fs = require('fs')
const employee = require("./models/employee");

const mongoose = require('mongoose');
const configureDB = require('./config/database');
const Employee = require('./models/employee');
const port = 3075
configureDB()


// To avoid the new line when printing
console.log = function (d) {
  process.stdout.write(d);
};


// For employee collectioon

fs.createReadStream('data.csv')
  .pipe(csv())
  .on('data', (data) => {
    
    var employee = new Employee({
        employeeId: data['EmployeeId'],
        firstName: data['First Name'],
        lastName: data['Last Name'],
        phoneNumber: data['Phone Number'],
        email: data['Email']
    });
    //save in database
    employee.save(function (err) {
        if (err) {
            console.log("There is an error in processing employee data: " + err);
        } else {
            console.log("Employee data has been saved: " + data);
        }
    })
})
  .on('end', () => {
    console.log("Done");
  });
