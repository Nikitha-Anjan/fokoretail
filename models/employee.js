const mongoose = require('mongoose')
const Schema = mongoose.Schema
const isNumeric= require('validator/lib/isNumeric')

const employeeSchema = new Schema({
    EmployeeID: {
        type: String, 
        required: true, 
        minlength: 7,
        unique: true,
        validate: {
            validator: function(value){
                let str = 'abcdefghijklmnopqrstuvwxyz'
                if(!(str.includes(value[0].toLowerCase()) && isNumeric(value.slice(1)))){
                    return false
                }
                return true
            },
            message: function(){
                return 'invalid employee Id'
            }
        }
    },
    Fname: {
        type: String, 
        required: [true, 'firstName is required']
    }, 
    Lname: {
        type: String, 
        required: [true, 'lastName is required']
    },
    Phone: {
        type: String,
        minlength:10,
        maxlength:14,
        required: [true, 'phoneNumber is required'],
        validate: {
            validator: function(value){
                let regex = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/
                if (!regex.test(value)){
                    return false 
                }
                return true
            },
            message: function(){
                return 'invalid phone number'
            }
        }
    },
    Email: {
        type: String,
        required: [true, 'email is required'],
        validate: {
            validator: function(value){
                let regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
                if (!regex.test(value)){
                    return false 
                }
                return true
            }, 
            message: function(){
                return 'invalid email format'
            }
        }
    }
},{ timestamps: true })

const Employee = mongoose.model('Employee', employeeSchema) 

module.exports = Employee