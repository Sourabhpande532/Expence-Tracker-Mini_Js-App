const head_card = document.getElementsByClassName("top_card")[0];
console.log(head_card)

const currency = document.getElementById("symbol")
console.log(currency)

const currentBalance = document.getElementById("balance")
console.log(currentBalance)

const transaction_Holder_Name = document.getElementById("transaction_name");
console.log(transaction_Holder_Name)

const Income = document.getElementById("income");
console.log(Income)

const Expense = document.getElementById("expense");  
// console.log(Expense)

const amount_filled = document.getElementById("transaction_amount");
console.log(amount_filled)

const transaction_proceed =  document.getElementById("add_transaction");
// console.log(transaction_proceed)
const cancel_Edit_Button = document.getElementById("cancel_edit");
// console.log(cancel_Edit_Button)

const transaction_List = document.getElementById("list_of_transactions")
console.log(transaction_List)

let currencySymbol = "Rs.";
let transactions = [];

let balance = 0
let editing_id = -1;


balance = Number(window.localStorage.getItem("balance")) || 0;
transactions = JSON.parse(window.localStorage.getItem("transactions")) || [];
console.log(transactions)  
/*currencySymbol = window.localStorage.getItem("currencySymbol") || window.prompt("Enter the currency you use:")*/

const save_Data = () => {
    window.localStorage.setItem("currencySymbol", currencySymbol);
    window.localStorage.setItem("balance", balance);
    window.localStorage.setItem("transactions", JSON.stringify(transactions)); 
} 

transaction_proceed.addEventListener("click", () => {
    let name = transaction_Holder_Name.value;
    let type = Income.checked ? "income" : "expence"
    let amount = Number(amount_filled.value)

    if(name == "" || amount == 0){
        alert("Name and amount can't be empty");
        return;
    }

    if(amount < 0){
        alert("Negetive amounts are not allowed");
        return;
    }

    let transaction = {
        name,
        amount, 
        type,
    }
    /* console.log(transaction)*/
    if(editing_id == -1)
    transactions.push(transaction)
    else{
     transactions[editing_id] = transaction; /*modify*/
     editing_id = -1;
    cancel_Edit_Button.style.display = "none"
    }

    transaction_Holder_Name.value = "";
    amount_filled.value = "";
    cancel_Edit_Button.style.display = "none"
    render();
    save_Data();
})

function edit(i){
    transaction = transactions[i]
    editing_id = i
    cancel_Edit_Button.style.display = "block"
    transaction_Holder_Name.value = transaction.name;
    if(transaction.type == "income"){
        Income.checked = true;
        Expense.checked = false;
    } else {
        Expense.checked = true;
        Income.checked = false;
    }

    amount_filled.value = transaction.amount
}

const render = () => {
    transaction_List.innerHTML = ``
    balancess = 0;

    if(transactions.length == 0){
        transaction_List.innerHTML = `<h3>No Transactions Found</h3>`
    } 

    transactions.forEach((e,i) => {
        transaction_List.innerHTML = `
        <li class="transaction ${e.type}">
            <p>${e.name}</p>
            <div class="right">
                <p>${currencySymbol}${e.amount}</p>
                <button class="link" onclick="edit(${i})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="link" onclick="del(${i})">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </div>
        </li>
        `
         + transaction_List.innerHTML;

        if(e.type == "income") balancess += e.amount;
        // 0 = 0 + 3000;
        // 3000 = 3000+2000;
        // 5000 = 5000 + x
        else balancess -= e.amount;
        // 0 = 0 - 3000;
        // -3000 = -3000 - 1000 ;
        // -4000 =  -4000 -  1200;
        // -5200 =  -5200 - 3500;

    })
    currency.innerHTML = `${currencySymbol}`

    currentBalance.innerHTML = `${balancess}`

    if(balancess < 0){
        head_card.classList.add("red")
    } else{
        head_card.classList.remove("red")
    }
}

render();
save_Data();

  
let cancelEdit = () => {
    editing_id = -1;  
    cancel_Edit_Button.style.display = "none"
    transaction_Holder_Name.value = "";
    amount_filled.value = "";
    render();
    save_Data();
}
function del(i) {
    transactions = transactions.filter((e,index) => i!=index);
    window.localStorage.setItem("transactions", JSON.stringify(transactions));
    render();
}
