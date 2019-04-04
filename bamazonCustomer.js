var mysql = require("mysql");
var inquirer = require("inquirer");
var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    port: 8889,
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;

    console.log(`Connected as id ${connection.threadId}.`);

    connection.query("select * from products", function (err, res) {
        if (err) throw err;


    })
});


function start() {
    inquirer
        .prompt({
            name: "options",
            type: "list",
            message: "Please select an item you would like to purchase.",
            choices: ["Kinetic Sand", "Barbie", "Guitar", "PS4", "T-Shirts", "Golf Clubs", "Chocolates", "Vitamins", "Protein Powder", "TV"]
        })
        .then(function (answer) {

            var userChoice = answer.options;

            var queryString = `SELECT quantity, price FROM products where product = '${userChoice}';`
            connection.query(queryString, function(err,res) {
                if (err) throw err;
                var result = res[0];
                promptQuantity(result.quantity, result.price, userChoice);
            })
        
        });

}

function promptQuantity(quantity, price, userChoice) {

    inquirer.prompt({
    name: "quantity",
    type: "input",
    message: "How many would you like to buy?",
}).then(function(answer){
    if(parseInt(answer.quantity) <= quantity) {
        console.log("Added to cart!")
        console.log("Your total is $" + (answer.quantity * price))
        var newQuantity = quantity - answer.quantity;
        var queryString = `UPDATE products SET quantity = ${newQuantity} where product = '${userChoice}'`
        connection.query(queryString, function(err) {
            if(err) throw err;
        })
    } else 
    {
        console.log("Sorry we dont have enough is stock!")
    }
    start();
});
} 

start();