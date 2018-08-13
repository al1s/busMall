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
  this.name = getName(filename);
  this.filename = filename;
  this.clicks = 0;
  this.shown = 0;
}

function getName(src) {
  return src.split('.')[0];
}
Product.prototype.toString = function productToString() {
  return this.name;
};

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
    products[elm.toString()].shown += 1;
  });
}

Quiz.prototype.addDomElm = function addDom() {
  Object.keys(this).forEach(productName => {
    var product = this[productName];
    var input = document.createElement('input');
    var label = document.createElement('label');
    var img = document.createElement('img');
    input.type = 'radio';
    input.name = 'quizRadio';
    input.id = productName;
    input.className = 'input  input__quiz';
    input.dataset.imgFilename = product.filename;
    label.for = input.id;
    label.appendChild(input);
    img.src = `img/${product.filename}`;
    label.appendChild(img);
    this[product.toString()].DOMElm = label;
  });
};

Quiz.prototype.render = function initialRender(destination) {
  while (destination.firstChild) {
    destination.removeChild(destination.firstChild);
  }
  Object.keys(this).forEach(productName => {
    destination.appendChild(this[productName].DOMElm);
  });
};

function handleClick(e) {
  var chosenPicture = e.target.dataset.imgFilename;
  products[getName(chosenPicture)].clicks += 1;
  var productListForQuiz = chooseRandom(productsToShow, [], products);
  var currentQuiz = new Quiz(productListForQuiz);
  currentQuiz.addDomElm();
  currentQuiz.render(app);
}

var app = document.getElementById('appForm');
app.addEventListener('input', handleClick);

productsToAdd.forEach(elm => (products[getName(elm)] = new Product(elm)));
var productListForQuiz = chooseRandom(productsToShow, [], products);
var currentQuiz = new Quiz(productListForQuiz);
currentQuiz.addDomElm();
currentQuiz.render(app);
