/*
 * JavaScript function definitions that are helpful when porting.
 */

/*
 * Return a random number N such that min <= N < max.
 *
 * This replaces
 * - random.uniform(min, max)
 */
function getRandom(min, max) {
  return (Math.random() * (max - min)) + min;
}

/*
 * Return a random integer N such that min <= N < max.
 *
 * This replaces
 * - random.randrange(min, max)
 * - random.randint(min, max - 1)
 * - random.choice(list) can be replaced by list[getRandomInteger(0, list.length)]
 */
function getRandomInteger(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor((Math.random() * (max - min)) + min);
}


/*
 * If you have not done trigonometry in a while,
 * here is how to convert between degrees and radians.
 */

function degreesToRadians(degrees) {
  return degrees * Math.PI / 180;
}

function radiansToDegrees(radians) {
  return radians * 180 / Math.PI;
}
