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

/*
 * A JavaScript 3-Dimensional vector based on pygame.math.Vector3.
 */
class Vecta3D {
  constructor() {
    let x, y, z;
    if (arguments.length === 1) {
      if (typeof arguments[0] === 'number') {
        x = arguments[0];
        y = arguments[0];
        z = arguments[0];
      }
      else if (typeof arguments[0] === 'object') {
        if (Array.isArray(arguments[0])) {
          [x=0, y=0, z=0] = arguments[0];
        }
        else {
          ({x=0, y=0, z=0} = arguments[0]);
        }
      }
      else {
        throw new Error('Not enough arguments.');
      }
    }
    else {
      [x=0, y=0, z=0] = arguments;
    }

    this.x = x;
    this.y = y;
    this.z = z;
  }

  /*
   * Return a new Vecta3D instance resulting from adding the other vector to this vector.
   */
  add() {
    let v;
    if (arguments.length <= 0) {
      throw new Error('Not enough arguments.');
    }
    if (arguments[0] instanceof Vecta3D) {
      v = arguments[0];
    }
    else {
      v = new Vecta3D(...arguments);
    }
    return new Vecta3D(this.x + v.x, this.y + v.y, this.z + v.z);
  }

  /*
   * Return a new Vecta3D instance resulting from subtracting the other vector from this vector.
   */
  subtract() {
    let v;
    if (arguments.length <= 0) {
      throw new Error('Not enough arguments.');
    }
    if (arguments[0] instanceof Vecta3D) {
      v = arguments[0];
    }
    else {
      v = new Vecta3D(...arguments);
    }
    return new Vecta3D(this.x - v.x, this.y - v.y, this.z - v.z);
  }

  /*
   * Return a new Vecta3D instance resulting from multiplying this vector by a Number.
   */
  multiply() {
    if (arguments.length <= 0) {
      throw new Error('Not enough arguments.');
    }
    if (typeof arguments[0] === 'number') {
      return new Vecta3D(this.x * arguments[0], this.y * arguments[0], this.z * arguments[0]);
    }
    return this.dot(...arguments);
  }

  /*
   * Return a new Vecta3D instance resulting from dividing this vector by a Number.
   */
  divide(divisor) {
    if (typeof divisor !== 'number') {
      throw new TypeError('divisor must be a Number.');
    }
    return new Vecta3D(this.x / divisor, this.y / divisor, this.z / divisor);
  }

  /*
   * Return true if this vector is equal to the other vector.
   */
  isEqual() {
    let v;
    if (arguments.length <= 0) {
      throw new Error('Not enough arguments.');
    }
    if (arguments[0] instanceof Vecta3D) {
      v = arguments[0];
    }
    else {
      v = new Vecta3D(...arguments);
    }
    return (Vecta.isAlmostEqual(this.x, v.x) && Vecta.isAlmostEqual(this.y, v.y) && Vecta.isAlmostEqual(this.z, v.z));
  }

  /*
   * Return a new Vecta3D instance resulting from rotating this vector by the given angle in degrees around axis.
   */
  rotate(degrees, axis) {
    return this.rotate_rad(degrees * Math.PI / 180, axis);
  }

  /*
   * Return a new Vecta3D instance resulting from rotating this vector by the given angle in radians around axis.
   */
  rotate_rad(radians, axis) {
    let v = new Vecta3D(this.x, this.y, this.z);
    v.rotate_ip_rad(radians, axis);
    return v;
  }

  /*
   * Rotate this vector by the given angle in degrees around axis.
   */
  rotate_ip(degrees, axis) {
    this.rotate_ip_rad(degrees * Math.PI / 180, axis);
  }

  /*
   * Rotate this vector by the given angle in radians around axis.
   */
  rotate_ip_rad() {
    if (arguments.length <= 1) {
      throw new Error('Not enough arguments.');
    }
    let args = Array.from(arguments),
        radians = args.shift(),
        axis;
    if (typeof radians !== 'number') {
      throw new TypeError('angle must be a Number.');
    }
    if (args[0] instanceof Vecta3D) {
      axis = args[0];
    }
    else {
      axis = new Vecta3D(...args);
    }

    // Duplicate the code in modulo() so this class does not depend on the function
    radians = ((radians % Vecta.TAU) + Vecta.TAU) % Vecta.TAU;
    if (Vecta.isAlmostEqual(radians, 0)) {
      return;
    }

    // Normalize the axis
    axis = axis.normalize();

    let sin = Math.sin(radians),
        cos = Math.cos(radians),
        cosComplement = 1 - cos,
        newX = ((this.x * (cos + (axis.x * axis.x * cosComplement))) +
                (this.y * ((axis.x * axis.y * cosComplement) - (axis.z * sin))) +
                (this.z * ((axis.x * axis.z * cosComplement) + (axis.y * sin)))),
        newY = ((this.x * ((axis.x * axis.y * cosComplement) + (axis.z * sin))) +
                (this.y * (cos + (axis.y * axis.y * cosComplement))) +
                (this.z * ((axis.y * axis.z * cosComplement) - (axis.x * sin)))),
        newZ = ((this.x * ((axis.x * axis.z * cosComplement) - (axis.y * sin))) +
                (this.y * ((axis.y * axis.z * cosComplement) + (axis.x * sin))) +
                (this.z * (cos + (axis.z * axis.z * cosComplement))));
    if (Vecta.isAlmostEqual(radians, Math.PI / 2)) {
      newX = ((this.x * (axis.x * axis.x)) +
              (this.y * ((axis.x * axis.y) - axis.z)) +
              (this.z * ((axis.x * axis.z) + axis.y)));
      newY = ((this.x * ((axis.x * axis.y) + axis.z)) +
              (this.y * (axis.y * axis.y)) +
              (this.z * ((axis.y * axis.z) - axis.x)));
      newZ = ((this.x * ((axis.x * axis.z) - axis.y)) +
              (this.y * ((axis.y * axis.z) + axis.x)) +
              (this.z * (axis.z * axis.z)));
    }
    else if (Vecta.isAlmostEqual(radians, Math.PI)) {
      newX = ((this.x * (-1 + (axis.x * axis.x * 2))) +
              (this.y * (axis.x * axis.y * 2)) +
              (this.z * (axis.x * axis.z * 2)));
      newY = ((this.x * (axis.x * axis.y * 2)) +
              (this.y * (-1 + (axis.y * axis.y * 2))) +
              (this.z * (axis.y * axis.z * 2)));
      newZ = ((this.x * (axis.x * axis.z * 2)) +
              (this.y * (axis.y * axis.z * 2)) +
              (this.z * (-1 + (axis.z * axis.z * 2))));
    }
    else if (Vecta.isAlmostEqual(radians, 3 * Math.PI / 2)) {
      newX = ((this.x * (axis.x * axis.x)) +
              (this.y * ((axis.x * axis.y) + axis.z)) +
              (this.z * ((axis.x * axis.z) - axis.y)));
      newY = ((this.x * ((axis.x * axis.y) - axis.z)) +
              (this.y * (axis.y * axis.y)) +
              (this.z * ((axis.y * axis.z) + axis.x)));
      newZ = ((this.x * ((axis.x * axis.z) + axis.y)) +
              (this.y * ((axis.y * axis.z) - axis.x)) +
              (this.z * (axis.z * axis.z)));
    }

    this.x = newX;
    this.y = newY;
    this.z = newZ;
  }

  /*
   * Return a new Vecta3D instance with the same direction but length 1.
   */
  normalize() {
    let v = new Vecta3D(this.x, this.y, this.z);
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
    this.z /= length;
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
    if (arguments[0] instanceof Vecta3D) {
      v = arguments[0];
    }
    else {
      v = new Vecta3D(...arguments);
    }
    return new Vecta3D((this.y * v.z) - (this.z * v.y), (this.z * v.x) - (this.x * v.z), (this.x * v.y) - (this.y * v.x));
  }

  /*
   * Return the dot product of this vector and the other vector.
   */
  dot() {
    let v;
    if (arguments.length <= 0) {
      throw new Error('Not enough arguments.');
    }
    if (arguments[0] instanceof Vecta3D) {
      v = arguments[0];
    }
    else {
      v = new Vecta3D(...arguments);
    }
    return ((this.x * v.x) + (this.y * v.y) + (this.z * v.z));
  }

  /*
   * Return the angle to the given vector in degrees.
   */
  angle_to() {
    let v, temp;
    if (arguments.length <= 0) {
      throw new Error('Not enough arguments.');
    }
    if (arguments[0] instanceof Vecta3D) {
      v = arguments[0];
    }
    else {
      v = new Vecta3D(...arguments);
    }
    temp = Math.sqrt(this.length_squared() * v.length_squared());
    if (temp <= 0) {
      throw new RangeError('angle to zero vector is undefined.');
    }

    return (Math.acos(((this.x * v.x) + (this.y * v.y) + (this.z * v.z)) / temp) * 180 / Math.PI);
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
    this.z *= fraction;
  }

  /*
   * Return the Euclidean length/magnitude of this vector.
   */
  length() {
    return Math.hypot(this.x, this.y, this.z);
  }

  /*
   * Return the squared Euclidean length/magnitude of this vector.
   */
  length_squared() {
    return ((this.x * this.x) + (this.y * this.y) + (this.z * this.z));
  }

  /*
   * Return a new Vecta3D instance of this vector reflected of the given normal.
   */
  reflect() {
    let n;
    if (arguments.length <= 0) {
      throw new Error('Not enough arguments.');
    }
    if (arguments[0] instanceof Vecta3D) {
      n = arguments[0];
    }
    else {
      n = new Vecta3D(...arguments);
    }

    let v = new Vecta3D(this.x, this.y, this.z);
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
    if (arguments[0] instanceof Vecta3D) {
      v = arguments[0];
    }
    else {
      v = new Vecta3D(...arguments);
    }

    if (Vecta.isAlmostEqual(v.length_squared(), 0)) {
      throw new RangeError('Normal must not be of length 0.');
    }

    let n = v.normalize(),
        dot_product = this.dot(n);
    this.x -= 2 * n.x * dot_product;
    this.y -= 2 * n.y * dot_product;
    this.z -= 2 * n.z * dot_product;
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
    if (arguments[0] instanceof Vecta3D) {
      v = arguments[0];
    }
    else {
      v = new Vecta3D(...arguments);
    }
    return (((v.x - this.x) * (v.x - this.x)) + ((v.y - this.y) * (v.y - this.y)) + ((v.z - this.z) * (v.z - this.z)));
  }
}
Vecta3D.prototype.toString = function () {
  return `[${ this.x }, ${ this.y }, ${ this.z }]`;
}
