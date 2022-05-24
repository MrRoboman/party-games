class Timer {
  constructor() {
    this.timeLeft = 0
  }

  start(time) {
    this.timeLeft = time
  }

  update(timePassed) {
    this.timeLeft -= timePassed
  }

  convertedTime() {
    if (this.timeLeft < 0) {
      return '0:00'
    }

    const totalSeconds = Math.floor(this.timeLeft / 1000)
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    const paddedZero = seconds < 10 ? '0' : ''

    return `${minutes}:${paddedZero}${seconds}`
  }

  show() {
    textSize(32)
    textAlign(CENTER, TOP)
    fill('darkmagenta')
    text(this.convertedTime(), width / 2, 10)
  }

  get complete() {
    return this.timeLeft <= 0
  }
}
