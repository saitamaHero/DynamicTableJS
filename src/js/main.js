const URL = 'api.dionicioacevedo.xyz/default.php';

const test = {"frutas": [
        {
            "id": "97a9faba76fe43b6ad31332952942786","name": "Manzana","price": 15800.25, quantity: 2},
        {
            "id": "817898bd17a14f8c6bb0fe445feac2a6","name": "Pera","price": -4008.35, quantity: 3
        }]};


        
const table = document.querySelector('#table');
const button = document.querySelector('.btn-danger');
const buttonAdd = document.querySelector('.btn-primary');
const parrafo =  document.querySelector('#parrafo');
const porPagina =  document.querySelector('#perPage');

const previous =  document.querySelector('#previous');
const next =  document.querySelector('#next');

const currentPage = document.querySelector('.text-muted');

previous.addEventListener('click', function(){
    myTable.pagination.previous();
});

next.addEventListener('click', function(){
    myTable.pagination.next();
});

button.addEventListener('click', function(){
    myTable.remove(myTable.data.length - 1);
});

buttonAdd.addEventListener('click', function(){
    for(let i = 0; i < 5; i++){
        let random = Math.floor( 1000 + (Math.random() * 1000));
        let quantityRandom = Math.floor( 1 + Math.random() * 10);
        myTable.addData([{
            "id": "817898bd17a14f8c6bb0fe445feac2a6","name": "Pera a "+random,"price": random +Math.random(), "quantity":quantityRandom
        }]);
    }
});

let myTable = new Table(table);

myTable.rowCallback = function(row, idx, arr){
    row['price'] = numeral(row['price']).format('0,00.00');
}

myTable.onperpagechange = function(pp){
    porPagina.value = pp;
}
myTable.onfinisherender = function(){
    currentPage.innerHTML = `${myTable.pagination.currentPage} de ${myTable.pagination.totalPages}`;
}

myTable.onpagechange = function(p, current, n, totalPages){
    //currentPage.innerHTML = `${current} de ${totalPages}`;
}

myTable.addHeaders([{label: '#', name: ''}, {label: 'Nombre', name: 'name'} , {label:'Precio', name: 'price'}, {label:'Cantidad', name: 'quantity'}]);

//{label:'ID', name: 'id'},

myTable.data = test.frutas;

myTable.pagination.enabled = true;
myTable.pagination.perPage = 10;

let discount = 0.03;

myTable.onrowclick = function(value, index, data){
    //console.log(value);
    let price = numeral(value['price']).format('0,0.00');
    let string = `El producto <strong>${value.name}</strong> tiene un precio de <strong>RD$ ${price}</strong>`;
    parrafo.innerHTML = string;

    //myTable.remove(index);
    value.quantity += 1;

    this.render();
}

myTable.render();