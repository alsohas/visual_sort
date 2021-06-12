let SIZE = 65;
let data = [];
let dataNormal = [];
let labels = [];

let MAX = 200;
let MIN = -200;

let SLEEP_DURATION = 10;

async function init() {
    for (let i = 0; i < SIZE - 1; i++) {
        labels.push(i + 1);
    }
    for (let i = 0; i < SIZE; i++) {
        dataNormal.push(boxMuller(MIN, MAX, 1));
    }
    for (let i = 0; i < SIZE; i++) {
        data.push(Math.floor(Math.random() * (MAX - MIN)) + MIN);
    }

    let startUniformButton = document.getElementById('startUniform');
    startUniformButton.addEventListener('click', startUniform);
    let startNormalButton = document.getElementById('startNormal');
    startNormalButton.addEventListener('click', startNormal);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Generates random number with normal probability within max and min.
 */
function boxMuller(min, max, skew) {
    let u = 0;
    let v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);

    num = num / 10.0 + 0.5;
    if (num > 1 || num < 0) num = boxMuller(min, max, skew);
    num = Math.pow(num, skew);
    num *= max - min;
    num += min;
    return num;
}


function start(displayData, hideData) {
    // clear the canvases
    const canvases = ['Bubble', 'Insertion', 'Merge', 'Selection', 'Quick'];
    for (const name of canvases) {
        let canvas = document.getElementById(name)
        let ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    let introDiv = document.getElementById('intro');
    introDiv.style.display = "none";

    const displayLabel = document.getElementById(`label${displayData}`);;
    const hideLabel = document.getElementById(`label${hideData}`);;
    const displayButton = document.getElementById(`start${displayData}`);;
    const hideButton = document.getElementById(`start${hideData}`);;

    hideButton.style.display = "block";
    hideLabel.style.display = "none";

    displayButton.style.display = "none";
    displayLabel.style.display = "block";

    insertionSort(data);
    bubbleSort(data);
    selectionSort(data);
    mergeSort(data);
    quickSort(data.slice(0));
}

function startUniform() {
    start('Uniform', 'Normal');
}

function startNormal() {
    start('Normal', 'Uniform');
}

async function draw(data, name) {
    let canvas = document.getElementById(name)
    let ctx = canvas.getContext('2d');
    // clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let myChart;
    let dataset = {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                backgroundColor: 'rgba(255,99,132,1)',
                data: data,
            }],
        },
        options: {
            tooltips: { enabled: false },
            hover: { mode: null },
            legend: { display: false },
            events: [],
            title: {
                display: true,
                text: `${name} Sort`,
            },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            },
            animation: false,
        },
    }
    myChart = new Chart(ctx, dataset);
    await sleep(SLEEP_DURATION);
}

async function insertionSort(data) {
    let items = data.slice(0);
    for (let i = 0; i < items.length; i++) {
        let value = items[i];
        for (var j = i - 1; j > -1 && items[j] > value; j--) {
            items[j + 1] = items[j];
            await draw(items, 'Insertion');
        }
        items[j + 1] = value;
    }
}

async function bubbleSort(data) {
    let items = data.slice(0);
    let length = items.length;
    for (let i = 0; i < length; i++) {
        for (let j = 0; j < (length - i - 1); j++) {
            if (items[j] > items[j + 1]) {
                let tmp = items[j];
                items[j] = items[j + 1];
                items[j + 1] = tmp;
                await draw(items, 'Bubble');
            }
        }
    }
}

async function selectionSort(data) {
    let items = data.slice(0);
    let temp = 0;
    for (let i = 0; i < items.length; ++i) {
        for (let j = i + 1; j < items.length; ++j) {
            if (items[i] > items[j]) {
                temp = items[i];
                items[i] = items[j];
                items[j] = temp;
                await draw(items, 'Selection');
            }
        }
    }
}

async function mergeSort(arr) {
    let items = arr.slice(0);
    let n = items.length;
    let sorted = new Array(n);

    for (var size = 1; size < n; size *= 2) {
        for (var leftStart = 0; leftStart < n; leftStart += 2 * size) {
            let left = leftStart,
                right = Math.min(left + size, n),
                leftLimit = right,
                rightLimit = Math.min(right + size, n),
                i = left;
            while (left < leftLimit && right < rightLimit) {
                if (items[left] <= items[right]) {
                    sorted[i++] = items[left++];
                } else {
                    sorted[i++] = items[right++];
                }
                await draw(sorted, "Merge");
            }
            while (left < leftLimit) {
                sorted[i++] = items[left++];
                await draw(sorted, "Merge");
            }
            while (right < rightLimit) {
                sorted[i++] = items[right++];
                await draw(sorted, "Merge");
            }
        }
        let temp = items;
        items = sorted;
        sorted = temp;
    }
}


async function swap(items, indexA, indexB) {
    let temp = items[indexA];
    items[indexA] = items[indexB];
    items[indexB] = temp;
    await draw(items, "Quick");
}

async function partition(items, pivot, leftIndex, rightIndex) {
    let storeIndex = leftIndex;
    let pivotValue = items[pivot];
    await swap(items, pivot, rightIndex);
    for (let i = leftIndex; i < rightIndex; i++) {
        if (items[i] < pivotValue) {
            await swap(items, i, storeIndex);
            storeIndex++;
        }
    }
    await swap(items, rightIndex, storeIndex);
    return storeIndex;
}

async function quickSort(items, leftIndex, rightIndex) {
    var pivot = null;
    if (typeof leftIndex !== 'number') {
        leftIndex = 0;
    }
    if (typeof rightIndex !== 'number') {
        rightIndex = items.length - 1;
    }
    if (leftIndex < rightIndex) {
        pivot = leftIndex + Math.ceil((rightIndex - leftIndex) * 0.5);
        newPivot = await partition(items, pivot, leftIndex, rightIndex);
        await quickSort(items, leftIndex, newPivot - 1);
        await quickSort(items, newPivot + 1, rightIndex);
    }
}

init();