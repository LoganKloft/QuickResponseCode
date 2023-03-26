import  { QR } from './qr.js';

let qr = new QR();

// display QR code
function displayCode(qrcode, matrix)
{
    for (const row of matrix)
    {
        let qrcode_row = document.createElement('div');
        qrcode_row.classList.add('qrcode-row');

        for (const cell of row)
        {
            let qrcode_cell = document.createElement('div');
            qrcode_cell.classList.add('qrcode-cell');

            if (cell === 1)
            {
                qrcode_cell.classList.add('qrcode-cell-black');
            }

            qrcode_row.appendChild(qrcode_cell);
        }

        qrcode.appendChild(qrcode_row);
    }
}

// matrix manipulation
function rotateMatrix(matrix)
{
    let newMatrix = qr.getNewMatrix(2);
    for (let i = 0; i < matrix.length; i++)
    {
        for (let j = 0; j < matrix[0].length; j++)
        {
            newMatrix[j][matrix.length - i - 1] = matrix[i][j];
        }
    }

    return newMatrix;
}

function fillArea(qrcode, row, col, width, height, label)
{
    for (let i = row; i < row + height; i++)
    {
        let rowNode = qrcode.children[i];
        for (let j = col; j < col + width; j++)
        {
            let cellNode = rowNode.children[j];
            cellNode.classList.add(label);
        }
    }
}

function addQuietZone(qrcode)
{
    let size = qrcode.childElementCount;

    // add four columns before each internal row
    for (const qrcode_row of qrcode.children)
    {
        for (let i = 0; i < 4; i++)
        {
            let qrcode_cell = document.createElement('div');
            qrcode_cell.classList.add('qrcode-cell');
            qrcode_row.insertBefore(qrcode_cell, qrcode_row.children[0]);
        }
    }

    // add four columns after each row row
    for (const qrcode_row of qrcode.children)
    {
        for (let i = 0; i < 4; i++)
        {
            let qrcode_cell = document.createElement('div');
            qrcode_cell.classList.add('qrcode-cell');
            qrcode_row.appendChild(qrcode_cell);
        }
    }

    // add four rows above qrcode
    for (let i = 0; i < 4; i++)
    {
        let qrcode_row = document.createElement('div');
        qrcode_row.classList.add('qrcode-row');

        for (let j = 0; j < size + 8; j++)
        {
            let qrcode_cell = document.createElement('div');
            qrcode_cell.classList.add('qrcode-cell');
            qrcode_row.appendChild(qrcode_cell);
        }

        qrcode.insertBefore(qrcode_row, qrcode.children[0]);
    }

    // add four rows below qrcode
    for (let i = 0; i < 4; i++)
    {
        let qrcode_row = document.createElement('div');
        qrcode_row.classList.add('qrcode-row');

        for (let j = 0; j < size + 8; j++)
        {
            let qrcode_cell = document.createElement('div');
            qrcode_cell.classList.add('qrcode-cell');
            qrcode_row.appendChild(qrcode_cell);
        }

        qrcode.appendChild(qrcode_row);
    }
}

function labelFinder(qrcode, label)
{
    let size = qrcode.childElementCount;
    [[0, 0], [size - 7, 0], [0, size - 7]].forEach(([row, col]) => {
        fillArea(qrcode, row, col, 7, 7, label);
        fillArea(qrcode, row + 1, col + 1, 5, 5, label);
        fillArea(qrcode, row + 2, col + 2, 3, 3, label);
      });
}

function labelAlignment(qrcode, label)
{
    const size = qrcode.childElementCount;
    fillArea(qrcode, size - 9, size - 9, 5, 5, label);
    fillArea(qrcode, size - 8, size - 8, 3, 3, label);
    fillArea(qrcode, size - 7, size - 7, 1, 1, label);
}

function labelTiming(qrcode, label)
{
    const size = qrcode.childElementCount;
    for (let pos = 8; pos < size - 9; pos += 2) {
    qrcode.children[6].children[pos].classList.add(label);
    qrcode.children[6].children[pos + 1].classList.add(label);
    qrcode.children[pos].children[6].classList.add(label);
    qrcode.children[pos + 1].children[6].classList.add(label);
    }
    qrcode.children[6].children[size - 9].classList.add(label);
    qrcode.children[size - 9].children[6].classList.add(label);
}

function labelQuietZone(qrcode, label)
{
    let size = qrcode.childElementCount;

    // label four columns before and after each internal row
    for (let i = 4; i < size - 4; i++)
    {
        let qrcode_row = qrcode.children[i];
        for (let j = 0; j < 4; j++)
        {
            qrcode_row.children[j].classList.add(label);
        }

        for (let j = size - 4; j < size; j++)
        {
            qrcode_row.children[j].classList.add(label);
        }
    }

    // label four rows above qrcode
    for (let i = 0; i < 4; i++)
    {
        let qrcode_row = qrcode.children[i];
        for (const child of qrcode_row.children)
        {
            child.classList.add(label);
        }
    }

    // label four rows below qrcode
    for (let i = size - 4; i < size; i++)
    {
        let qrcode_row = qrcode.children[i];
        for (const child of qrcode_row.children)
        {
            child.classList.add(label);
        }
    }
}

function labelFormat(qrcode, label)
{
    let size = qrcode.childElementCount;

    // upper left
    for (let i = 0; i < 6; i++)
    {
        qrcode.children[8].children[i].classList.add(label);
    }
    for (let i = 0; i < 6; i++)
    {
        qrcode.children[i].children[8].classList.add(label);
    }
    qrcode.children[8].children[8].classList.add(label);
    qrcode.children[7].children[8].classList.add(label);
    qrcode.children[8].children[7].classList.add(label);

    // upper right
    for (let i = size - 1; i > size - 9; i--)
    {
        qrcode.children[8].children[i].classList.add(label);
    }

    // lower left
    for (let i = size - 1; i > size - 8; i--)
    {
        qrcode.children[i].children[8].classList.add(label);
    }
}

function numberFormat(qrcode)
{
    let size = qrcode.childElementCount;

    let count = 1;
    // upper left
    for (let i = 0; i < 6; i++)
    {
        qrcode.children[8].children[i].textContent = count;
        count++;
    }
    count = 15;
    for (let i = 0; i < 6; i++)
    {
        qrcode.children[i].children[8].textContent = count;
        count--;
    }
    qrcode.children[8].children[8].textContent = 8;
    qrcode.children[7].children[8].textContent = 9;
    qrcode.children[8].children[7].textContent = 7;

    // upper right
    count = 8;
    for (let i = size - 1; i > size - 9; i--)
    {
        qrcode.children[8].children[i].textContent = count;
        count++;
    }

    // lower left
    count = 1;
    for (let i = size - 1; i > size - 8; i--)
    {
        qrcode.children[i].children[8].textContent = count;
        count++;
    }
}

function labelDarkModule(qrcode, label)
{
    let size = qrcode.childElementCount;
    qrcode.children[size - 8].children[8].classList.add(label);
}

function AddStringToElementAsBinary(str, el)
{
    let s = '';
    for (let i = 0; i < str.length; i++)
    {
        s += ("00000000" + str.charCodeAt(i).toString(2)).slice(-8);
    }

    el.textContent = s;
}

function AddNumberListToElementAsBinary(list, el)
{
    let s = '';
    for (const num of list)
    {
        s += ("00000000" + num.toString(2)).slice(-8);;
    }

    el.textContent = s;
}

function rule1RowHelper(matrix, qrcode, label, row)
{
    let count = 0;
    let current = -1;
    let penalty = 0;
    let i = 0;

    for (; i < matrix.length; i++)
    {
        if (matrix[row][i] != current)
        {
            // label row-wise if count > 4
            if (count > 4)
            {
                let j = i - 1;
                while(count > 0)
                {
                    qrcode.children[row].children[j].classList.add(label);
                    j--;
                    count--;
                }
            }

            count = 1;
            current = matrix[row][i];
        }
        else
        {
            count++;
            if (count === 5)
            {
                penalty += 3;
            }
            else if (count > 5)
            {
                penalty++;
            }
        }
    }

    // label row-wise if count > 4
    if (count > 4)
    {
        let j = i - 1;
        while(count > 0)
        {
            qrcode.children[row].children[j].classList.add(label);
            j--;
            count--;
        }
    }

    return penalty;
}

function rule1ColHelper(matrix, qrcode, label, col)
{
    let count = 0;
    let current = -1;
    let penalty = 0;
    let i = 0;

    for (; i < matrix.length; i++)
    {
        if (matrix[i][col] != current)
        {
            // label col-wise if count > 4
            if (count > 4)
            {
                let j = i - 1;
                while(count > 0)
                {
                    qrcode.children[j].children[col].classList.add(label);
                    count--;
                    j--;
                }
            }

            count = 1;
            current = matrix[i][col];
        }
        else
        {
            count++;
            if (count === 5)
            {
                penalty += 3;
            }
            else if (count > 5)
            {
                penalty++;
            }
        }
    }

    // label col-wise if count > 4
    if (count > 4)
    {
        let j = i - 1;
        while(count > 0)
        {
            qrcode.children[j].children[col].classList.add(label);
            count--;
            j--;
        }
    }

    return penalty;
}

function labelRule1(matrix, qrcode, label)
{
    let totalPenalty = 0;

    // Rule 1
    for (let i = 0; i < matrix.length; i++)
    {
        totalPenalty += rule1RowHelper(matrix, qrcode, label, i);
        totalPenalty += rule1ColHelper(matrix, qrcode, label, i);
    }

    return totalPenalty;
}

function labelRule2(matrix, qrcode, label)
{
    let totalPenalty = 0;
    let blocks = 0;
    const size = matrix.length
    for (let row = 0; row < size - 1; row++) {
      for (let column = 0; column < size - 1; column++) {
        const module = matrix[row][column];
        if (
          matrix[row][column + 1] === module &&
          matrix[row + 1][column] === module &&
          matrix[row + 1][column + 1] === module
        ) {
            qrcode.children[row].children[column].classList.add(label);
            qrcode.children[row + 1].children[column].classList.add(label);
            qrcode.children[row].children[column + 1].classList.add(label);
            qrcode.children[row + 1].children[column + 1].classList.add(label);
            blocks++;
        }
      }
    }
    totalPenalty += blocks * 3;
    return totalPenalty;
}

function labelRule3(matrix, qrcode, label)
{
    const RULE_3_PATTERN = new Uint8Array([1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0]);
    const RULE_3_REVERSED_PATTERN = RULE_3_PATTERN.slice().reverse();
    const size = matrix.length;
    let totalPenalty = 0;
    // Rule 3
    let patterns = 0;
    for (let index = 0; index < size; index++) {
      const row = matrix[index];
      for (let columnIndex = 0; columnIndex < size - 11; columnIndex++) {
        if ([RULE_3_PATTERN, RULE_3_REVERSED_PATTERN].some(
          pattern => pattern.every(
            (cell, ptr) => cell === row[columnIndex + ptr]
          )
        )) {
            // add label
            for (let i = 0; i < 11; i++)
            {
                qrcode.children[index].children[columnIndex + i].classList.add(label);
            }
          patterns++;
        }
      }
      for (let rowIndex = 0; rowIndex < size - 11; rowIndex++) {
        if ([RULE_3_PATTERN, RULE_3_REVERSED_PATTERN].some(
          pattern => pattern.every(
            (cell, ptr) => cell === matrix[rowIndex + ptr][index]
          )
        )) {
            // add label
            for (let i = 0; i < 11; i++)
            {
                qrcode.children[rowIndex + i].children[index].classList.add(label);
            }
          patterns++;
        }
      }
    }
    totalPenalty += patterns * 40;
    return totalPenalty;
}

const MASK_FNS = [
    (row, column) => ((row + column) & 1) === 0,
    (row, column) => (row & 1) === 0,
    (row, column) => column % 3 === 0,
    (row, column) => (row + column) % 3 === 0,
    (row, column) => (((row >> 1) + Math.floor(column / 3)) & 1) === 0,
    (row, column) => ((row * column) & 1) + ((row * column) % 3) === 0,
    (row, column) => ((((row * column) & 1) + ((row * column) % 3)) & 1) === 0,
    (row, column) => ((((row + column) & 1) + ((row * column) % 3)) & 1) === 0,
];
function setMask(mask, index)
{
    for (let i = 0; i < 6; i++)
    {
        let mask_row = document.createElement('div');
        mask_row.classList.add('qrcode-row');

        for (let j = 0; j < 6; j++)
        {
            let mask_cell = document.createElement('div');
            mask_cell.classList.add('qrcode-cell');

            if ( MASK_FNS[index](i, j) )
            {
                mask_cell.classList.add('qrcode-cell-black');
            }

            mask_row.appendChild(mask_cell);
        }

        mask.appendChild(mask_row);
    }
}

let matrix = qr.getNewMatrix(2);
let codewords = qr.getCodewords();

// display full qrcode
const qrcode = document.querySelector('.qrcode');
displayCode(qrcode, qr.getOptimalMask(2, codewords, 0)[0]);

// display finder pattern
const qrcode_finder = document.querySelector('.qrcode-finder');
qr.placeFinderPattern(matrix);
displayCode(qrcode_finder, matrix);
labelFinder(qrcode_finder, 'highlight-module');

// const qrcode_separators = document.querySelector('.qrcode-separators');
// qr.placeSeparators(matrix);
// displayCode(qrcode_separators, matrix);

const qrcode_timing = document.querySelector('.qrcode-timing');
qr.placeTimingPattern(matrix);
displayCode(qrcode_timing, matrix);
labelTiming(qrcode_timing, 'highlight-module');

const qrcode_alignment = document.querySelector('.qrcode-alignment');
qr.placeAlignmentPattern(matrix);
displayCode(qrcode_alignment, matrix);
labelAlignment(qrcode_alignment, 'highlight-module');

const qrcode_dark_module = document.querySelector('.qrcode-dark-module');
qr.placeDarkModule(matrix);
displayCode(qrcode_dark_module, matrix);
labelDarkModule(qrcode_dark_module, 'highlight-module');

let formatMatrix = qr.getNewMatrix(2);
const qrcode_format = document.querySelector('.qrcode-format');
qr.placeFixedPatterns(formatMatrix);
displayCode(qrcode_format, formatMatrix);
labelFormat(qrcode_format, 'highlight-module');

let quietMatrix = qr.getNewMatrix(2);
const qrcode_quiet_zone = document.querySelector('.qrcode-quiet-zone');
qr.placeFixedPatterns(quietMatrix);
displayCode(qrcode_quiet_zone, quietMatrix);
addQuietZone(qrcode_quiet_zone);
labelQuietZone(qrcode_quiet_zone, 'highlight-module');

let message_heading = document.querySelector('.message-bits');
AddStringToElementAsBinary('https://www.qrcode.com/', message_heading);

let data = qr.getByteData('https://www.qrcode.com/', 8, 28);
let edc = qr.getEDC(data, 44);
let edc_heading = document.querySelector('.edc-bits');
AddNumberListToElementAsBinary(edc, edc_heading);

// place bits
let sequence = qr.getModuleSequence(2);
let placement_matrix = qr.getNewMatrix(2);
let qrcode_placement = document.querySelector('.qrcode-placement');
qr.placeFixedPatterns(placement_matrix);
let count = 1;
displayCode(qrcode_placement, placement_matrix);
sequence.forEach(([row, col]) => {
    qrcode_placement.children[row].children[col].textContent = count;
    if (count == 8)
    {
        count = 0;
    }
    count++;
})
let qrcode_maskless = document.querySelector('.qrcode-maskless');
let maskless_matrix = qr.getRawQRCode('https://www.qrcode.com/')
displayCode(qrcode_maskless, maskless_matrix);

// mask
let qrcode_maskless_copy = document.querySelector('.qrcode-maskless-copy');
displayCode(qrcode_maskless_copy, maskless_matrix);
numberFormat(qrcode_maskless_copy);
let qrcode_pattern1 = document.querySelector('.qrcode-pattern1');
let masked_matrix = qr.getMaskedQRCode(2, qr.getCodewords(), 0, 0);
displayCode(qrcode_pattern1, masked_matrix);

// best mask
let qrcode_rule1 = document.querySelector('.qrcode-rule1');
displayCode(qrcode_rule1, masked_matrix);
let score = labelRule1(masked_matrix, qrcode_rule1, 'highlight-module');
let rule1_score = document.querySelector('.rule1-score');
rule1_score.textContent = score;
let qrcode_rule2 = document.querySelector('.qrcode-rule2');
displayCode(qrcode_rule2, masked_matrix);
let rule2_score = document.querySelector('.rule2-score');
rule2_score.textContent = labelRule2(masked_matrix, qrcode_rule2, 'highlight-module');
let qrcode_rule3 = document.querySelector('.qrcode-rule3');
displayCode(qrcode_rule3, masked_matrix);
let rule3_score = document.querySelector('.rule3-score');
rule3_score.textContent = labelRule3(masked_matrix, qrcode_rule3, 'highlight-module');
let total = document.querySelector('.total');
let rule4_score = qr.getRule4(masked_matrix);
total.textContent = `Total = ${Number(rule1_score.textContent)} + ${Number(rule2_score.textContent)} + ${Number(rule3_score.textContent)} + ${rule4_score} = ${Number(rule1_score.textContent) + Number(rule2_score.textContent) + Number(rule3_score.textContent) + rule4_score}`;

for (let i = 0; i < 8; i++)
{
    let rule = document.querySelector(`.rule${i}`);
    setMask(rule, i);
    let mask_matrix = qr.getMaskedQRCode(2, qr.getCodewords(), 0, i);
    let total_score = document.querySelector(`.total${i}`);
    total_score.textContent = qr.getPenaltyScore(mask_matrix);
}

const qrcode_final = document.querySelector('.qrcode-final');
displayCode(qrcode_final, qr.getOptimalMask(2, codewords, 0)[0]);

gsap.registerPlugin(ScrollTrigger);

// Fixed Patterns
let sections = gsap.utils.toArray(".panel");
console.log(sections.length - 1);
let scrollTween = gsap.to(sections, {
    xPercent: -100 * (sections.length - 1),
    ease: "none", // <-- IMPORTANT!
    scrollTrigger: {
      trigger: ".container-fixed",
      pin: true,
      scrub: 0.1,
      //snap: directionalSnap(1 / (sections.length - 1)),
      end: "+=" + document.querySelector(".container-fixed").offsetWidth
    }
});

gsap.from('.finder-pattern-title', {
    opacity: 0,
    duration: 2,
    scrollTrigger: {
        trigger: '.qrcode-finder',
        start: 'bottom bottom',
        toggleActions: 'restart none none reset'
    }
})

gsap.from('.fixed-patterns', {
    opacity: 0,
    duration: 3,
    scrollTrigger: {
        trigger: '.qrcode-finder',
        toggleActions: 'restart none none reset'
    }
})

// ScrollTrigger.defaults({markers: {startColor: "black", endColor: "black"}});

// gsap.to('.qrcode-finder', {
//     rotation: 180,
//     scrollTrigger: {
//         trigger: '.qrcode-finder-wrapper',
//         containerAnimation: scrollTween,
//         start: '0% 25%',
//         end: '100% 35%',
//         scrub: true
//     }
// })

// gsap.to('.qrcode-finder', {
//     x: '-100px',
//     duration: '3',
//     scrollTrigger: {
//         trigger: '.qrcode-finder',
//         markers: true,
//         start: '50% 50%',
//         toggleActions: 'restart none none none'
//     }
// })

// construction
let construction_sections = gsap.utils.toArray(".construction-panel");

let construction_scrollTween = gsap.to(construction_sections, {
    xPercent: -100 * (construction_sections.length - 1),
    ease: "none", // <-- IMPORTANT!
    scrollTrigger: {
      trigger: ".construction-container",
      pin: true,
      scrub: 0.1,
      //snap: directionalSnap(1 / (sections.length - 1)),
      end: "+=" + document.querySelector(".construction-container").offsetWidth
    }
});