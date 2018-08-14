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
//
// Day 2
// (UI) add a11n functionality to the page:
//   check tab browsing;
//   outline for selected element;
// (engine) separate DOM elements creation from switching pictures;

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

function addDom(arr) {
  return arr.map(_ => {
    var input = document.createElement('input');
    var label = document.createElement('label');
    var img = document.createElement('img');
    input.type = 'radio';
    input.name = 'quizRadio';
    input.className = 'input  input__quiz';
    img.className = 'img form__img';
    label.className = 'label  label__quiz';
    label.appendChild(input);
    label.appendChild(img);
    return label;
  });
}

function updateQuiz(quizArr, valuesArr, destination) {
  quizArr.forEach((elm, ndx) => {
    Array.from(elm.children).forEach(nodeElm => {
      var quizElm = valuesArr[ndx];
      quizElm.shown += 1;
      console.log(nodeElm.tagName);
      if (nodeElm.tagName === 'INPUT') {
        console.log(quizElm);
        nodeElm.checked = false;
        nodeElm.id = quizElm.name;
        nodeElm.dataset.imgFilename = quizElm.filename;
      } else if (nodeElm.tagName === 'IMG') {
        nodeElm.src = `img/${quizElm.filename}`;
        nodeElm.alt = `Picture of ${quizElm.name}`;
      }
    });
    destination.appendChild(elm);
  });
}

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

function renderProduct() {
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

function render() {
  numberOfRounds -= 1;
  if (numberOfRounds >= 0) {
    var productListForQuiz = chooseRandom(productsToShow, [], products);
    // currentQuiz = currentQuiz || new Quiz(productListForQuiz);
    // currentQuiz.addDomElm();
    // currentQuiz.update(appForm);
    updateQuiz(currentQuiz, productListForQuiz, appForm);
  } else {
    appForm.removeEventListener('input', handleClick);
    clearElm(appForm);
    renderData(products, appTable);
  }
}

var currentQuiz = new Array(productsToShow).fill(0);
currentQuiz = addDom(currentQuiz);
var appForm = document.getElementById('appForm');
var appTable = document.getElementById('appForm');
appForm.addEventListener('input', handleClick);
productsToAdd.forEach(elm => (products[getName(elm)] = new Product(elm)));

render();
