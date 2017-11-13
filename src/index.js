;(function () {
  const iminge = new (require('Iminge'))()

  if (typeof module !== 'undefined' && typeof exports === 'object') { // CommonJS support
    module.exports = iminge
  } else if (typeof define === 'function' && (define.amd || define.cmd)) { // AMD, CMD support
    define(() => iminge)
  } else { // Raw using support
    this.image = iminge
  }
}).call(this || (typeof window !== 'undefined' ? window : global) || {})
