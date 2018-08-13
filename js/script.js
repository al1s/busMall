'use strict';
// show random three pictures on the page;
// keep click results for each picture;
// after 25 clicks:
//   removeEventListeners;
//   show results;

// Objects:
//   products
//     .name: product
//     .chooseRandom(number, skipProducts)
//   product
//     .filename
//     .clicks
//     .ctr
//   quiz
//     .render()
//     .updateView()

var productsToShow = 3;
var numberOfRounds = 25;
var products = {};
var productsToAdd = [
  'bag.jpg',
  'banana.jpg',
  'bathroom.jpg',
  'boots.jpg',
  'breakfast.jpg',
  'bubblegum.jpg',
  'chair.jpg',
  'cthulhu.jpg',
  'dog-duck.jpg',
  'dragon.jpg',
  'pen.jpg',
  'pet-sweep.jpg',
  'scissors.jpg',
  'shark.jpg',
  'sweep.png',
  'tauntaun.jpg',
  'unicorn.jpg',
  'usb.gif',
  'water-can.jpg',
  'wine-glass.jpg'
];

function Product(filename) {
  this.name = this.getName(filename);
  this.filename = filename;
  this.clicks = 0;
  this.ctr = 0;
}

Product.prototype.getName = function(src) {
  return src.split('.')[0];
};
Product.prototype.toString = function productToString() {
  return this.name;
};

productsToAdd.forEach(elm => (products[elm] = new Product(elm)));

function randomRange(arr) {
  return Math.floor(Math.random() * arr.length);
}

function chooseRandom(productsToShow, skipList, products) {
  var arr = Object.keys(products);
  var skip = [...skipList];
  var result = [];
  for (let i = 0; i < productsToShow; i++) {
    do {
      var randomNumberRange = randomRange(arr);
      var randomProduct = products[arr[randomNumberRange]];
    } while (skip.includes(randomProduct.toString()));
    result.push(randomProduct);
    skip.push(randomProduct.toString());
  }
  return result;
}

function Quiz(randomProducts) {
  randomProducts.forEach(elm => {
    this[elm.toString()] = elm;
  });
}

Quiz.prototype.addDomElm = function addDom() {
  Object.keys(this).forEach(productName => {
    var product = this[productName];
    var input = document.createElement('input');
    var label = document.createElement('label');
    var img = document.createElement('img');
    input.type = 'radio';
    input.name = productName;
    input.id = productName;
    input.className = 'input  input__quiz';
    label.for = input.id;
    label.appendChild(input);
    img.src = `img/${product.filename}`;
    label.appendChild(img);
    this[product.toString()].DOMElm = label;
  });
};
