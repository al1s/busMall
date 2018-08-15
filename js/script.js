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

// app vars
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

// little helpers
function getName(src) {
  return src.split('.')[0];
}

function randomRange(arr) {
  return Math.floor(Math.random() * arr.length);
}

function clearElm(elm) {
  while (elm.firstChild) {
    elm.removeChild(elm.firstChild);
  }
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function Product(filename) {
  this.name = getName(filename);
  this.filename = filename;
  this.clicks = 0;
  this.shown = 0;
}

Product.prototype.toString = function productToString() {
  return this.name;
};

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
  var result = [];
  for (let i = 0; i < arr.length; i++) {
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
    result.push(label);
  }
  return result;
}

function updateQuiz(quizArr, valuesArr, destination) {
  quizArr.forEach((elm, ndx) => {
    Array.from(elm.children).forEach(nodeElm => {
      var quizElm = valuesArr[ndx];
      quizElm.shown += 1;
      if (nodeElm.tagName === 'INPUT') {
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

function mapData(dataInput) {
  var data = Object.keys(dataInput)
    .sort((a, b) => dataInput[b].shown - dataInput[a].shown)
    .reduce(
      (result, elm) => {
        result.datasets[0].data.push(dataInput[elm].shown);
        result.datasets[1].data.push(dataInput[elm].clicks);
        result.labels.push(capitalize(elm));
        return result;
      },
      { labels: [], datasets: [{ data: [] }, { data: [] }] }
    );
  data.datasets[0].label = 'Shown';
  data.datasets[0].backgroundColor = 'rgba(200,0,0,0.2)';
  data.datasets[1].label = 'Clicked';
  data.datasets[1].backgroundColor = 'rgba(0,0,200,0.2)';

  return data;
}

function buildChart(data) {
  var chartBar = document.createElement('canvas');
  canvasContainer.appendChild(chartBar);

  var options = {
    scales: {
      xAxes: [{ stacked: true }],
      yAxes: [
        {
          stacked: false,
          ticks: { beginAtZero: true }
        }
      ]
    }
  };

  new Chart(chartBar.getContext('2d'), {
    type: 'bar',
    data,
    options
  });
}

// function mockupProducts(products) {
//   numberOfRounds = 0;
//   Object.keys(products).forEach(elm => {
//     var rNum = Math.floor(Math.random() * 20);
//     products[elm].shown = rNum;
//     products[elm].clicks = Math.floor(rNum / Math.floor(Math.random() * 2));
//   });
// }

function saveResult(oldData, newData) {
  console.log({ oldData });
  console.log({ newData });
  if (oldData) {
    oldData = JSON.parse(oldData);
    Object.keys(newData).forEach(elm => {
      newData[elm].shown += oldData[elm].shown;
      newData[elm].clicks += oldData[elm].clicks;
    });
  }
  localStorage.setItem('products', JSON.stringify(newData));
}

function populateData(productLikeData, products) {
  var productLikeObj = JSON.parse(productLikeData);
  Object.keys(productLikeObj).forEach(productName => {
    products[productName] = Object.assign(
      new Product(productLikeObj[productName].filename)
    );
  });
}

function handleClick(e) {
  var chosenPicture = e.target.dataset.imgFilename;
  products[getName(chosenPicture)].clicks += 1;
  render();
}

function render() {
  numberOfRounds -= 1;
  if (numberOfRounds >= 0) {
    var productListForQuiz = chooseRandom(productsToShow, [], products);
    updateQuiz(currentQuiz, productListForQuiz, appForm);
    notifyMsgElm.innerText = `${numberOfRounds + 1} rounds left.`;
  } else {
    appForm.removeEventListener('input', handleClick);
    clearElm(appForm);
    notifyMsgElm.innerText = 'Results of your choice';

    saveResult(hasData, products);
    buildChart(mapData(products));
  }
}

// main
var currentQuiz = new Array(productsToShow).fill(0);
currentQuiz = addDom(currentQuiz);
var appForm = document.getElementById('appForm');
var notifyMsgElm = document.getElementById('notifyMsg');
var canvasContainer = document.querySelector('.canvas__wrapper');
appForm.addEventListener('input', handleClick);
var hasData = localStorage.getItem('products');
if (!hasData) {
  productsToAdd.forEach(elm => (products[getName(elm)] = new Product(elm)));
} else {
  populateData(hasData, products);
}
// test Charts
// mockupProducts(products);

render();
