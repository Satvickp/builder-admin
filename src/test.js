// let date = new Date();
// let fromDate = new Date(date.getFullYear(), date.getMonth(), 2);
// let endDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
// console.log(fromDate);
// console.log(endDate);
function func1() {
  console.log("Function 1 is called.");
}

function func2() {
  console.log("Function 2 is called.");
  func1(); // Call func1 inside func2
}

// Test the functions
func2();
