/**
 * print one line
 * @param text print text
 * @param breakLine print break line if true
 */
const printLine = (text: string, breakLine: boolean = true) => {
  process.stdout.write(text + (breakLine ? '\n' : ''))
}
/**
 * prompt stdin input
 * @param text print prompt text
 * @returns input string
 */
const promptInput = async (text: string) => {
  printLine(`\n${text}\n> `, false)
  const input: string = await new Promise((resolve) => process.stdin.once('data', (data) => resolve(data.toString())))
  return input.trim()
}
/**
 * game class
 */
class HitAndBlow {
  /**
   * answer item source
   */
  private readonly answerSource = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
  /**
   * set answer item
   */
  private answer: string[] = []
  /**
   * game try count
   */
  private tryCount = 0
  /**
   * mode
   */
  private mode: 'nomal' | 'hard'
  /**
   * constructor
   * @param {'nomal' | 'hard'} mode 
   */
  constructor(mode: 'nomal' | 'hard') {
    this.mode = mode
  }
  /**
   * initialize game
   */
  setting() {
    const answerLength = this.getAnswerLength()
    while (this.answer.length < answerLength) {
      const randNum = Math.floor(Math.random() * this.answerSource.length)
      const selectedItem = this.answerSource[randNum]
      if (!this.answer.includes(selectedItem)) {
        this.answer.push(selectedItem)
      }
    }
  }
  /**
   * playing game
   */
  async play() {
    const answerLength = this.getAnswerLength()
    const inputArr = (await promptInput(`input ${answerLength} num separate ,`)).split(',')

    if (!this.validate(inputArr)) {
      printLine('error input')
      await this.play()
      return
    }

    const result = this.check(inputArr)

    if (result.hit !== this.answer.length) {
      printLine(`---\nhit: ${result.hit}\nblow: ${result.blow}\n---`)
      this.tryCount++
      await this.play()
    } else {
      this.tryCount++
    }
  }
  /**
   * game end
   */
  end() {
    printLine(`success!\ntry times: ${this.tryCount}`)
    process.exit()
  }
  /**
   * check input
   * @param input input string
   * @returns hit: hit count, blow: blow count
   */
  private check(input: string[]) {
    let hitCount = 0
    let blowCount = 0

    input.forEach((val, index) => {
      if (val === this.answer[index]) {
        hitCount++
      } else if (this.answer.includes(val)) {
        blowCount++
      }
    })
    return {
      hit: hitCount, blow: blowCount
    }
  }
  /**
   * validate input
   * @param inputArr input string
   * @returns true if validate
   */
  private validate(inputArr: string[]) {
    const isLengthValid = inputArr.length === this.answer.length
    const isAllAnswerSourceOption = inputArr.every((val) => this.answerSource.includes(val))
    const isAllDifferentValues = inputArr.every((val, i) => inputArr.indexOf(val) === i)
    return isLengthValid && isAllAnswerSourceOption && isAllDifferentValues
  }
  /**
   * get answer length
   * @returns {number}
   */
  private getAnswerLength() {
    switch (this.mode) {
      case 'nomal':
        return 3
      case 'hard':
        return 4
    }
  }
}
/**
 * IIFE
 */
; (async () => {
  const hitAndBlow = new HitAndBlow('hard')
  hitAndBlow.setting()
  await hitAndBlow.play()
  hitAndBlow.end()
})()