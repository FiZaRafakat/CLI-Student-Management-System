#! /usr/bin/env node
import inquirer from "inquirer";
import chalk from "chalk";
let Balance = 0;
let students = [];
async function animate(text) {
    for (let char of text) {
        process.stdout.write(char);
        await new Promise((resolve) => {
            setTimeout(resolve, 20);
        });
    }
}
await animate(chalk.magenta.bold("\n\n\t\t\tWELCOME TO FIZA'S STUDENTS MANAGEMENT SYSTEM\n"));
await animate(chalk.grey("\t\t--------------------------------------------------------------\n\n"));
async function enrollStudent() {
    let addStudent = await inquirer.prompt({
        name: "name",
        type: "input",
        message: chalk.greenBright("Enter student name: \n\t ")
    });
    let studentName = addStudent.name;
    let courses = await inquirer.prompt({
        name: "course",
        type: "list",
        message: chalk.greenBright("Select Course\t"),
        choices: ["HTML", "CSS", "TYPESCRIPT", "PYTHON", "MS OFFICE", "JAVA", "C++"]
    });
    let fee = {
        "HTML": 2500,
        "CSS": 2500,
        "TYPESCRIPT": 5000,
        "PYTHON": 7000,
        "MS OFFICE": 2000,
        "JAVA": 8000,
        "C++": 10000
    };
    await animate(chalk.grey(`\n\t\t\tTution Fee : ${fee[courses.course]}\n\n`));
    let paymentType = await inquirer.prompt([
        {
            name: "payment",
            type: "list",
            message: chalk.greenBright("Select Payment Method \t"),
            choices: ["Bank Transfer", "Easypaisa", "Cash"]
        },
        {
            name: "amount",
            type: "number",
            message: chalk.greenBright("Enter payment amount : \n\t")
        }
    ]);
    if (fee[courses.course] <= paymentType.amount) {
        let id = generateUniqueID();
        students.push({ name: studentName, course: courses.course, id: id, balance: paymentType.amount });
        Balance += paymentType.amount;
        await animate(chalk.bgGreen.whiteBright.bold(`\n\t\t\t${studentName} with ID ${id} is enrolled in course ${courses.course}\n`));
    }
    else {
        await animate(chalk.bgRed.bold(`\n\t\t\tInvalid Amount. Enrollment failed.\n`));
    }
    await animate(chalk.grey("\t\t--------------------------------------------------------------\n\n"));
}
async function viewCourseFees() {
    await animate(chalk.magenta.underline("\n\n\t\t\t\tCourse Fees:\n\n"));
    Object.entries({
        "HTML": 2500,
        "CSS": 2500,
        "TYPESCRIPT": 5000,
        "PYTHON": 7000,
        "MS OFFICE": 2000,
        "JAVA": 8000,
        "C++": 10000
    }).forEach(([course, fee]) => {
        console.log(chalk.yellow(`\t\t\t\t${course}: ${fee}`));
    });
    await animate(chalk.grey("\t\t--------------------------------------------------------------\n\n"));
}
function generateUniqueID() {
    let id;
    do {
        id = Math.floor(10000 + Math.random() * 90000);
    } while (students.some(student => student.id === id));
    return id;
}
async function viewBalance() {
    await animate(chalk.bgCyan.blackBright.underline(`\n\t\t\tTotal Balance in our account : ${Balance}\n\n`));
    const studentNames = students.map(student => student.name);
    const selectedStudent = await inquirer.prompt({
        name: "name",
        type: "list",
        message: chalk.greenBright("Select Student name:\t"),
        choices: studentNames
    });
    const student = students.find(student => student.name === selectedStudent.name);
    await animate(chalk.whiteBright(`\n\t\t\t${student.name} has a Balance of ${student.balance}\n`));
    await animate(chalk.grey("\t\t--------------------------------------------------------------\n\n"));
}
async function showStatus() {
    const studentNames = students.map(student => student.name);
    const selectedStudent = await inquirer.prompt({
        name: "name",
        type: "list",
        message: chalk.greenBright("Select Student name:\t"),
        choices: studentNames
    });
    const student = students.find(student => student.name === selectedStudent.name);
    await animate(chalk.magenta.underline("\n\t\t\t\tStatus\n\n"));
    console.log(chalk.yellow(`\t\t\tStudent Name: ${student.name}`));
    console.log(chalk.yellow(`\t\t\tStudent ID: ${student.id}`));
    console.log(chalk.yellow(`\t\t\tCourse Enrolled: ${student.course}`));
    console.log(chalk.yellow(`\t\t\tBalance: ${student.balance}`));
    await animate(chalk.grey("\t\t--------------------------------------------------------------\n\n"));
}
async function main() {
    let operations = await inquirer.prompt({
        name: "operation",
        type: "list",
        message: chalk.greenBright("What would you like to do?\t"),
        choices: ["Enroll Student", "View Balance", "Show Status", "View Course Fees", "Exit"]
    });
    switch (operations.operation) {
        case "Enroll Student":
            await enrollStudent();
            break;
        case "View Balance":
            await viewBalance();
            break;
        case "Show Status":
            await showStatus();
            break;
        case "View Course Fees":
            await viewCourseFees();
            break;
        case "Exit":
            await animate(chalk.magenta.bold("\n\t\t\tThank you for using our service.\n"));
            await animate(chalk.grey("\t\t--------------------------------------------------------------\n\n"));
            return;
    }
    main(); // Recursive call to continue the program
}
main();
