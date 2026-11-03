// A JavaScript copy of java.util.Random.
//
// The Java backend creates its sample orders with `new Random(2026)`.
// Using the same algorithm here means the Node backend creates exactly the
// same customers and orders, so both backends have identical test data.
//
// Java's Random is a "linear congruential generator" working on 48-bit numbers.
// JavaScript numbers cannot hold 48-bit multiplications exactly, so BigInt is used.

const MULTIPLIER = 0x5DEECE66Dn;
const ADDEND = 0xBn;
const MASK = (1n << 48n) - 1n;

export class JavaRandom {
  constructor(seed) {
    this.seed = (BigInt(seed) ^ MULTIPLIER) & MASK;
  }

  // Returns the next `bits` random bits as a signed 32-bit number, like Java's next(bits).
  next(bits) {
    this.seed = (this.seed * MULTIPLIER + ADDEND) & MASK;
    return Number(BigInt.asIntN(32, this.seed >> BigInt(48 - bits)));
  }

  // Random whole number from 0 (inclusive) to bound (exclusive).
  nextInt(bound) {
    if (!Number.isInteger(bound) || bound <= 0) {
      throw new Error('bound must be a positive integer');
    }
    if ((bound & -bound) === bound) {
      // bound is a power of 2
      return Number((BigInt(bound) * BigInt(this.next(31))) >> 31n);
    }
    let bits;
    let value;
    do {
      bits = this.next(31);
      value = bits % bound;
    } while (bits - value + (bound - 1) > 2147483647);
    return value;
  }

  // Random decimal number from 0.0 (inclusive) to 1.0 (exclusive).
  nextDouble() {
    const high = BigInt(this.next(26));
    const low = BigInt(this.next(27));
    return Number((high << 27n) + low) / 2 ** 53;
  }

  nextBoolean() {
    return this.next(1) !== 0;
  }
}
