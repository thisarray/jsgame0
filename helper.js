/*
 * JavaScript function definitions that are helpful when porting.
 */

/*
 * Return the result of the modulo operation dividend modulo divisor.
 *
 * The remainder operator (%) in JavaScript always takes the sign of the dividend.
 * This trips you up when you come from Python and expect it to be a
 * modulo operator for a negative dividend.
 * This function correctly returns the non-negative remainder like Python.
 */
function modulo(dividend, divisor) {
  return (((dividend % divisor) + divisor) % divisor);
}

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
 * Shuffle Array x in place.
 */
function shuffle(x) {
  let j, temp;
  for (let i = x.length - 1; i > 0; i--) {
    // pick an element in x[:i+1] with which to exchange x[i]
    j = getRandomInteger(0, i + 1);
    temp = x[i];
    x[i] = x[j];
    x[j] = temp;
  }
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


/*
 * A JavaScript 2-Dimensional vector based on pygame.math.Vector2.
 */
class Vecta {
  static TAU = Math.PI * 2;

  /*
   * Return true if the Numbers first and second are equal to places.
   *
   * This is necessary because JavaScript Number is a floating point value and is not exact.
   */
  static isAlmostEqual(first, second, places = 7) {
    if (typeof first !== 'number') {
      return false;
    }
    if (typeof second !== 'number') {
      return false;
    }
    return (first.toFixed(places) === second.toFixed(places));
  }

  constructor() {
    let x, y;
    if (arguments.length === 1) {
      if (typeof arguments[0] === 'number') {
        x = arguments[0];
        y = arguments[0];
      }
      else if (typeof arguments[0] === 'object') {
        if (Array.isArray(arguments[0])) {
          [x=0, y=0] = arguments[0];
        }
        else {
          ({x=0, y=0} = arguments[0]);
        }
      }
      else {
        throw new Error('Not enough arguments.');
      }
    }
    else {
      [x=0, y=0] = arguments;
    }

    this.x = x;
    this.y = y;
  }

  /*
   * Return a new Vecta instance resulting from adding the other vector to this vector.
   */
  add() {
    let v;
    if (arguments.length <= 0) {
      throw new Error('Not enough arguments.');
    }
    if (arguments[0] instanceof Vecta) {
      v = arguments[0];
    }
    else {
      v = new Vecta(...arguments);
    }
    return new Vecta(this.x + v.x, this.y + v.y);
  }

  /*
   * Return a new Vecta instance resulting from subtracting the other vector from this vector.
   */
  subtract() {
    let v;
    if (arguments.length <= 0) {
      throw new Error('Not enough arguments.');
    }
    if (arguments[0] instanceof Vecta) {
      v = arguments[0];
    }
    else {
      v = new Vecta(...arguments);
    }
    return new Vecta(this.x - v.x, this.y - v.y);
  }

  /*
   * Return a new Vecta instance resulting from multiplying this vector by a Number.
   */
  multiply() {
    if (arguments.length <= 0) {
      throw new Error('Not enough arguments.');
    }
    if (typeof arguments[0] === 'number') {
      return new Vecta(this.x * arguments[0], this.y * arguments[0]);
    }
    return this.dot(...arguments);
  }

  /*
   * Return a new Vecta instance resulting from dividing this vector by a Number.
   */
  divide(divisor) {
    if (typeof divisor !== 'number') {
      throw new TypeError('divisor must be a Number.');
    }
    return new Vecta(this.x / divisor, this.y / divisor);
  }

  /*
   * Return true if this vector is equal to the other vector.
   */
  isEqual() {
    let v;
    if (arguments.length <= 0) {
      throw new Error('Not enough arguments.');
    }
    if (arguments[0] instanceof Vecta) {
      v = arguments[0];
    }
    else {
      v = new Vecta(...arguments);
    }
    return (Vecta.isAlmostEqual(this.x, v.x) && Vecta.isAlmostEqual(this.y, v.y));
  }

  /*
   * Return a new Vecta instance resulting from rotating this vector by the given angle in degrees.
   */
  rotate(degrees) {
    return this.rotate_rad(degrees * Math.PI / 180);
  }

  /*
   * Return a new Vecta instance resulting from rotating this vector by the given angle in radians.
   */
  rotate_rad(radians) {
    let v = new Vecta(this.x, this.y);
    v.rotate_ip_rad(radians);
    return v;
  }

  /*
   * Rotate this vector by the given angle in degrees.
   */
  rotate_ip(degrees) {
    this.rotate_ip_rad(degrees * Math.PI / 180);
  }

  /*
   * Rotate this vector by the given angle in radians.
   */
  rotate_ip_rad(radians) {
    // Duplicate the code in modulo() so this class does not depend on the function
    radians = ((radians % Vecta.TAU) + Vecta.TAU) % Vecta.TAU;
    if (Vecta.isAlmostEqual(radians, 0)) {
      return;
    }
    let sin = Math.sin(radians),
        cos = Math.cos(radians),
        newX = (cos * this.x) - (sin * this.y),
        newY = (sin * this.x) + (cos * this.y);
    if (Vecta.isAlmostEqual(radians, Math.PI / 2)) {
      newX = -this.y;
      newY = this.x;
    }
    else if (Vecta.isAlmostEqual(radians, Math.PI)) {
      newX = -this.x;
      newY = -this.y;
    }
    else if (Vecta.isAlmostEqual(radians, 3 * Math.PI / 2)) {
      newX = this.y;
      newY = -this.x;
    }

    this.x = newX;
    this.y = newY;
  }

  /*
   * Return a new Vecta instance with the same direction but length 1.
   */
  normalize() {
    let v = new Vecta(this.x, this.y);
    v.normalize_ip();
    return v;
  }

  /*
   * Scale this vector to have length 1.
   */
  normalize_ip() {
    let length = this.length();
    if (length <= 0) {
      throw new RangeError('Cannot normalize Vector of length 0.');
    }
    this.x /= length;
    this.y /= length;
  }

  /*
   * Return true if this vector has length 1.
   */
  is_normalized() {
    return Vecta.isAlmostEqual(this.length_squared(), 1);
  }

  /*
   * Return the cross product of this vector and the other vector.
   */
  cross() {
    let v;
    if (arguments.length <= 0) {
      throw new Error('Not enough arguments.');
    }
    if (arguments[0] instanceof Vecta) {
      v = arguments[0];
    }
    else {
      v = new Vecta(...arguments);
    }
    return ((this.x * v.y) - (this.y * v.x));
  }

  /*
   * Return the dot product of this vector and the other vector.
   */
  dot() {
    let v;
    if (arguments.length <= 0) {
      throw new Error('Not enough arguments.');
    }
    if (arguments[0] instanceof Vecta) {
      v = arguments[0];
    }
    else {
      v = new Vecta(...arguments);
    }
    return ((this.x * v.x) + (this.y * v.y));
  }

  /*
   * Return the angle to the given vector in degrees.
   */
  angle_to() {
    let v;
    if (arguments.length <= 0) {
      throw new Error('Not enough arguments.');
    }
    if (arguments[0] instanceof Vecta) {
      v = arguments[0];
    }
    else {
      v = new Vecta(...arguments);
    }
    return ((Math.atan2(v.y, v.x) - Math.atan2(this.y, this.x)) * 180 / Math.PI);
  }

  /*
   * Scale this vector to the given length.
   */
  scale_to_length(newLength) {
    let length = this.length(),
        fraction;
    if (length <= 0) {
      throw new RangeError('Cannot scale Vector of length 0.');
    }
    fraction = newLength / length;
    this.x *= fraction;
    this.y *= fraction;
  }

  /*
   * Return the Euclidean length/magnitude of this vector.
   */
  length() {
    return Math.hypot(this.x, this.y);
  }

  /*
   * Return the squared Euclidean length/magnitude of this vector.
   */
  length_squared() {
    return ((this.x * this.x) + (this.y * this.y));
  }

  /*
   * Return a new Vecta instance of this vector reflected of the given normal.
   */
  reflect() {
    let n;
    if (arguments.length <= 0) {
      throw new Error('Not enough arguments.');
    }
    if (arguments[0] instanceof Vecta) {
      n = arguments[0];
    }
    else {
      n = new Vecta(...arguments);
    }

    let v = new Vecta(this.x, this.y);
    v.reflect_ip(n);
    return v;
  }

  /*
   * Reflect this vector of the given normal.
   */
  reflect_ip() {
    let v;
    if (arguments.length <= 0) {
      throw new Error('Not enough arguments.');
    }
    if (arguments[0] instanceof Vecta) {
      v = arguments[0];
    }
    else {
      v = new Vecta(...arguments);
    }

    if (Vecta.isAlmostEqual(v.length_squared(), 0)) {
      throw new RangeError('Normal must not be of length 0.');
    }

    let n = v.normalize(),
        dot_product = this.dot(n);
    this.x -= 2 * n.x * dot_product;
    this.y -= 2 * n.y * dot_product;
  }

  /*
   * Return the Euclidean distance to the given vector.
   */
  distance_to() {
    return Math.sqrt(this.distance_squared_to(...arguments));
  }

  /*
   * Return the squared Euclidean distance to the given vector.
   */
  distance_squared_to() {
    let v;
    if (arguments.length <= 0) {
      throw new Error('Not enough arguments.');
    }
    if (arguments[0] instanceof Vecta) {
      v = arguments[0];
    }
    else {
      v = new Vecta(...arguments);
    }
    return (((v.x - this.x) * (v.x - this.x)) + ((v.y - this.y) * (v.y - this.y)));
  }

  /*
   * Set the coordinates of this vector to the new values.
   */
  update() {
    let v;
    if (arguments.length <= 0) {
      throw new Error('Not enough arguments.');
    }
    if (arguments[0] instanceof Vecta) {
      v = arguments[0];
    }
    else {
      v = new Vecta(...arguments);
    }
    this.x = v.x;
    this.y = v.y;
  }
}
Vecta.prototype.toString = function () {
  return `[${ this.x }, ${ this.y }]`;
}
