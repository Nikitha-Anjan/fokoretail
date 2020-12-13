const csv = require('csv-parser')
const fs = require('fs');
var stringify = require('csv-stringify')

const configureDB = require('./config/database');
const Employee = require('./models/employee');
const port = 3075
configureDB()


// For employee collectioon

fs.createReadStream('data.csv')
  .pipe(csv())
  .on('data', (data) => {
    
    for (var key in data) {
        data[key.trim()] = data[key].trim();
    }
    delete data[key]

    var employee = new Employee({
        employeeID: data['EmployeeID'],
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
            console.log("Employee data has been saved");

            var myArgs = process.argv.slice(2)

            if(myArgs[1] == '--output=./'){
                const createCsvWriter = require('csv-writer').createObjectCsvWriter;
                const csvWriter = createCsvWriter({
                    path: './output.csv',
                    header:['EmployeeID','Fname','Lname','Phone','Email','Date Created','Date Updated']
                });

                csvWriter.writeRecords(data)       // returns a promise
                    .then(() => {
                        console.log('...Done');
                    });
                }
        }
    })
})
  .on('end', () => {
    console.log("Done");
  });
