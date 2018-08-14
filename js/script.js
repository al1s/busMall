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
Product.prototype.renderProduct = renderProduct;

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
    label.className = 'label  label__quiz';
    label.appendChild(input);
    img.src = `img/${product.filename}`;
    img.className = 'img form__img';
    label.appendChild(img);
    this[product.toString()].DOMElm = label;
  });
};

Quiz.prototype.update = function initialRender(destination) {
  clearElm(destination);
  Object.keys(this).forEach(productName => {
    destination.appendChild(this[productName].DOMElm);
  });
};

function clearElm(elm) {
  while (elm.firstChild) {
    elm.removeChild(elm.firstChild);
  }
}
//================== Came from Salmon Cookies =====================
function createElmWithContent(elmName, elmClass, content) {
  var elm = document.createElement(elmName);
  elm.className = elmClass;
  elm.textContent = content;
  return elm;
}

function renderProduct(target) {
  var row = createElmWithContent('tr', 'table__body  row');
  row.appendChild(createElmWithContent('th', 'header__cell', this.name));
  row.appendChild(createElmWithContent('td', 'body__cell', this.clicks));
  row.appendChild(createElmWithContent('td', 'body__cell', this.shown));
  return row;
}

function renderHeader(headerElmList) {
  var headerDeclaration = createElmWithContent('thead', 'table__header');
  var headerRow = createElmWithContent('tr', 'header__row');
  var headerNodes = headerElmList.map(elm =>
    createElmWithContent('th', 'header__cell', elm)
  );
  headerNodes.forEach(elm => headerRow.appendChild(elm));
  headerDeclaration.appendChild(headerRow);
  return headerDeclaration;
}

function renderData(data, parentElm) {
  // create text header for current table
  parentElm.appendChild(
    createElmWithContent('h2', 'table__text-header', 'Results of your choice')
  );

  // create table
  var tableElm = parentElm.appendChild(createElmWithContent('table', 'table'));

  // generate header and put it to storage
  var header = renderHeader(['Product name', 'Clicks', 'Shown']);
  var body = document.createElement('tbody');

  // generate rows, put it to storage and append to parent element
  var rows = [];
  // add rows for each store
  Object.keys(data).forEach(elm => {
    var row = data[elm].renderProduct(parentElm);
    body.appendChild(row);
  });

  // generate footer and put it to storage
  tableElm.appendChild(header);
  tableElm.appendChild(body);
}
//=======================================

function handleClick(e) {
  var chosenPicture = e.target.dataset.imgFilename;
  products[getName(chosenPicture)].clicks += 1;
  render();
}

function showResult(products) {}

function render() {
  numberOfRounds -= 1;
  if (numberOfRounds >= 0) {
    var productListForQuiz = chooseRandom(productsToShow, [], products);
    var currentQuiz = new Quiz(productListForQuiz);
    currentQuiz.addDomElm();
    currentQuiz.update(appForm);
  } else {
    appForm.removeEventListener('input', handleClick);
    clearElm(appForm);
    renderData(products, appTable);
  }
}

var appForm = document.getElementById('appForm');
var appTable = document.getElementById('appForm');
appForm.addEventListener('input', handleClick);
productsToAdd.forEach(elm => (products[getName(elm)] = new Product(elm)));

render();
