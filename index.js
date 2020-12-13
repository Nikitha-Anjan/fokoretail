const csv = require("csv-parser");
const fs = require("fs");

const configureDB = require("./config/database");
const Employee = require("./models/employee");
const port = 3075;

configureDB();
let count = 0;

var myArgs = process.argv.slice(2);

if (myArgs[1] == "--output=./") {
  var csvHeadersLine =
    "EmployeeID,Fname,Lname,Phone,Email,Date Created,Date Updated\n";
  fs.writeFileSync("./output.csv", csvHeadersLine, (err) => {
    if (err) {
      console.log(err);
    }
  });
}

if ((myArgs.length >0 ) && (myArgs[0].indexOf("input") >= 0)){
    // For employee collection
    fs.createReadStream("./data.csv")
      .pipe(csv())
      .on("data", (data) => {
        count++;
        for (var key in data) {
          data[key.trim()] = data[key].trim();
        }

        var employee = new Employee({
          EmployeeID: data["EmployeeID"],
          Fname: data["First Name"],
          Lname: data["Last Name"],
          Phone: data["Phone Number"],
          Email: data["Email"],
        });

        //save in database
        employee.save(function (err, savedObj) {
          if (err) {
            console.log(
              "Line Number " +
                count +
                " There is an error in processing employee data: " +
                err
            );
          } else {
            console.log("Employee data has been saved");

            if (myArgs[1] == "--output=./") {
              savedObj = savedObj.toObject();
              let csvOutput = `${savedObj["EmployeeID"]},${savedObj["Fname"]},${savedObj["Lname"]},${savedObj["Phone"]},${savedObj["Email"]},${savedObj["createdAt"]},${savedObj["updatedAt"]}`;
              fs.appendFile("./output.csv", csvOutput + "\n", (err) => {
                if (err) {
                  console.log(err);
                }
              });
            }
          }
        });
      })
      .on("end", () => {
        console.log("Done");
      })
  } else {
    console.log("Please provide input parameter")
} 

