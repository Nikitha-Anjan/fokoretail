const csv = require('csv-parser')
const fs = require('fs');
//import csvAppend from "csv-append"
const csvAppend =require('csv-append')

const configureDB = require('./config/database');
const Employee = require('./models/employee');
const port = 3075
configureDB()
let count =0

// For employee collectioon

 fs.createReadStream('./data.csv')
  .pipe(csv())
  .on('data', (data) => {
    
    count++

    for (var key in data) {
        data[key.trim()] = data[key].trim();
    }
    delete data[key]

    var employee = new Employee({
        EmployeeID: data['EmployeeID'],
        Fname: data['First Name'],
        Lname: data['Last Name'],
        Phone: data['Phone Number'],
        Email: data['Email']
    });
    //save in database
    employee.save(function (err,savedObj) {
        if (err) {
            console.log("Line Number " +count+" There is an error in processing employee data: " + err);
        } else {
            console.log("Employee data has been saved");

            var myArgs = process.argv.slice(2)

            if(myArgs[1] == '--output=./'){

            let  arr = []

                    fs.appendFile("./output.csv", arr + "\n",(err) =>{
                        if (err) { 
                            console.log(err); 
                          } 
                    })

                //}

                //const createCsvWriter = require('csv-writer').createObjectCsvWriter;
                //const csvWriter = createCsvWriter({
                //    path: './output.csv',
                //   header:[{id:'EmployeeID', title:'EmployeeID'},
                //            {id:'Fname', title:'Fname'},
                //            {id:'Lname', title:'Lname'},
                //            {id:'Phone', title:'Phone'},
                 //           {id:'Email', title:'Email'},   
                 //           {id:'createdAt', title:'Date Created'},
                 //           {id:'updatedAt', title:'Date Updated'}
               // ]
               // })
                
               //savedObj['Date Created'] = savedObj['createdAt']
                //savedObj['Date Updated'] = savedObj['updatedAt']
                //console.log(savedObj,'savedObj')
               //let csvdata = []
               // csvdata.push(savedObj)
                //let csvdata = Object.values(savedObj)

                //csvWriter.writeRecords(csvdata)       // returns a promise
                //    .then(() => {
                //        console.log('...Done');
                //    });


            }
        }
    }
    )
})
  .on('end', () => {
    console.log("Done");
  });
