// You thought you could just open the JavaScript source and find an important clue? You were right.
var inputString = "CNVG4kFHVQkTQxKpBK/0WSKJeKTkkTkW3IKkjdr4nrnnj6d4krerIkrEDNdenXjXUnWKDxujFkEQQVMKIkcQ/nKPS9Sd9nuS"
// I couldn't exactly hide that string from you, nor did I want to hide it.
// (I could've waited for someone to manually decode it from the colors in the animation, but that would've been cruel)
// That string contains within it both the seed phrase and password, waiting to be decoded by a lucky winner!
// Beyond that string, there are a few other ways in which the NFT itself contains information necessary to solve the puzzle.
// These mechanisms will be clarified in the future via public hints.
// One final note: If you're trying to solve this puzzle, you should follow my Twitter (@MathMakesArt) for hints. And if you haven't read RULES.txt yet, you should do that as well!
var stringArrLength = 0; // Placeholder


//Hard Coded
var backgroundColor = 255;
var totalWidth = window.innerWidth;
var totalHeight = window.innerHeight;
totalWidth = 960;
totalHeight = 960;
var numRows = 12;
var numCols = 12;
var grid = [];
var fr = 30; // Framerate in FPS
var frameCount = 0; // Number of frames elapsed since first draw() call
// Computed
var cellWidth = Math.floor(totalWidth / numCols);
var cellHeight = Math.floor(totalHeight / numRows);
// Obfuscated
var derivationPath = "m/44'/1729'/0'/0'";


// Returns true for valid characters and false for invalid characters
// In this program, a "valid" character exists in the standard base64 digits
function isValidChar(charIn) {
  var charCodeIn = charIn.charCodeAt();
  if (((charCodeIn >= 65) && (charCodeIn <= 90)) ||  // 'A'-'Z'
      ((charCodeIn >= 97) && (charCodeIn <= 122)) || // 'a'-'z'
      ((charCodeIn >= 48) && (charCodeIn <= 57)) ||  // '0'-'9'
      (charCodeIn == 43) ||                          // '+'
      (charCodeIn == 47)) {                          // '/'
    return true;
  }
  return false;
}


function sanitizeString(stringIn) {
  // Performs replacements for characters with defined 1:1 pairs
  let stringOut = stringIn;
  stringOut = stringOut.replace(".", "/+");
  stringOut = stringOut.replace(" ", "+");
  stringOut = stringOut.replace("\n", "/n");

  // Removes unrecognized characters by replacing with "//"
  let inputLength = stringOut.length;
  let arrayOut = []
  for (var i = 0; i < inputLength; i++) {
    let currentInt = charToInt(stringOut[i]);
    if (currentInt == -1) {
      arrayOut.push(63)
      arrayOut.push(63)
    }
    else {
      arrayOut.push(currentInt)
    }
  }

  // Returns the sanitized string as an array of base64 values
  return arrayOut;
}


// Essentially an extended version of isValidChar() which:
//  - Returns "-1" for non-base64 characters (instead of false)
//  - Returns the [0, 63] base64 value for valid characters (instead of true)
function charToInt(charIn) {
  var charCodeIn = charIn.charCodeAt();

  // 'A' through 'Z'
  if ((charCodeIn >= 65) && (charCodeIn <= 90)) {
    return charCodeIn - 65;
  }
  // 'a' through 'z'
  else if ((charCodeIn >= 97) && (charCodeIn <= 122)) {
    return charCodeIn - 71;
  }
  // '0' through '9'
  else if ((charCodeIn >= 48) && (charCodeIn <= 57)) {
    return charCodeIn + 4;
  }
  // '+'
  else if (charCodeIn == 43) {
    return 62
  }
  // '/'
  else if (charCodeIn == 47) {
    return 63
  }
  else {
    return -1
  }
}


// Converts a base64 integer into an RGB color where:
//  - The two most significant bits (32 and 16) determine the R intensity
//  - The next two bits (8 and 4) determine the G intensity
//  - The two least significant bits (2 and 1) determine the B intensity
//  - Final [0, 3] values are multipled by 85.0 to achieve [0, 255] scaling
// Will fail if given an integer with a value outside of [0, 63] inclusive
function intToColorArr(intIn) {
  if ((intIn < 0) || (intIn > 63)) {
    error("function intoToColorArr(intIn) called with invalid integer");
  }
  let rVal = floor(intIn / 16);
  let gVal = floor((intIn % 16) / 4);
  let bVal = intIn % 4;
  return [rVal * 85, gVal * 85, bVal * 85];
}


function setup() {
  // put setup code here
  colorMode(RGB, 255); // Sets the color interpretation mode
  rectMode(CORNER); // Sets the rectangle interpretation mode
  createCanvas(window.innerWidth, window.innerHeight);
  textAlign(CENTER, CENTER);
  frameRate(fr);

  // Computes sanitized version of the input string
  var stringArr = sanitizeString(inputString);
  stringArrLength = stringArr.length;

  // Initializes the count as 0
  var currentCount = 0;

  // Construct the grid and fill with colors pertaining to each integer in stringArr
  for (var y = 0; y < numRows; y++) {
    // Push a new empty (row) array into the grid
    grid.push([]);

    // loop through all cells of the current row
    for (var x = 0; x < numCols; x++) {
      // Push a new empty (cell) array into the current row of the grid
      grid[y].push([]);
      // Get the integer associated with the character at currentCount, and convert it to a color
      grid[y][x] = intToColorArr(stringArr[currentCount % stringArrLength]);
      // Increment currentCount
      currentCount++;
    }
  }
  // Call windowResized once before drawing begins
  windowResized();
}


function draw() {
  // put drawing code here
  background(backgroundColor);

  // Initializes the count as 0
  var currentCount = 0;

  // loop through all rows in the grid
  for (var y = 0; y < numRows; y++) {

    // loop through all cells of the current row
    for (var x = 0; x < numCols; x++) {

      // Get the color associated with the current grid position
      currentColor = color(grid[y][x][0], grid[y][x][1], grid[y][x][2]);

      // Determine proper drawing position and draw a rectangle
      currentScreenX = x * cellWidth;
      currentScreenY = y * cellHeight;
      currentScreenX += 0.5 * cellWidth * Math.sin(frameCount * .005 * grid[y][x][0] / 85)
      currentScreenY += 0.5 * cellHeight * Math.sin(frameCount * .005 * grid[y][x][1] / 85)
      currentSizeMultiplier = (1 - Math.sin(frameCount * .005 * grid[y][x][2] / 85)) * 1.02


      fill(currentColor);
      noStroke();
      rect(currentScreenX, currentScreenY, cellWidth * currentSizeMultiplier, cellHeight * currentSizeMultiplier);

      // Increment currentCount
      currentCount++;
    }
  }

  // Increment frameCount
  frameCount++;
}


function windowResized() {
  //resizeCanvas(window.innerWidth, window.innerHeight)
  resizeCanvas(totalWidth, totalHeight)
}