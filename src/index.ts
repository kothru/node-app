import { read } from "fs"

/**
 * print one line
 * @param {string} text print text
 * @param {boolean} breakLine print break line if true
 */
const printLine = (text: string, breakLine: boolean = true) => {
  process.stdout.write(text + (breakLine ? '\n' : ''))
}
/**
 * prompt stdin input
 * @param {string} text print prompt text
 * @returns {string} input string
 */
const promptInput = async (text: string) => {
  printLine(`\n${text}\n> `, false)
  return readLine()
}
/**
 * prompt stdin input select only values
 * @param {string} text print prompt text
 * @param {readonly string[]} values select list
 * @returns {string|Promise<string>} select value
 */
const promptSelect = async <T extends string>(text: string, values: readonly T[]): Promise<T> => {
  printLine(`\n${text}`)
  values.forEach((value) => {
    printLine(`- ${value}`)
  })
  printLine(`> `, false)

  const input = (await readLine()) as T
  if (values.includes(input)) {
    return input
  } else {
    return promptSelect<T>(text, values)
  }
}
/**
 * read stdin one line
 * @returns {string} read line string
 */
const readLine = async () => {
  const input: string = await new Promise((resolve) => process.stdin.once('data', (data) => resolve(data.toString())))
  return input.trim()
}
/**
 * mode array
 */
const modes = ['normal', 'hard', 'very hard'] as const
/**
 * mode type
 */
type Mode = typeof modes[number]
/**
 * Game selector
 */
class GameProcedure {
  /**
   * current select game title
   */
  private currentGameTitle = 'hit and blow'
  /**
   * current game instance
   */
  private currentGame = new HitAndBlow()
  /**
   * game start proc
   */
  public async start() {
    await this.play()
  }
  /**
   * game play proc
   */
  private async play() {
    printLine(`===\n${this.currentGameTitle} start\n===`)
    await this.currentGame.setting()
    await this.currentGame.play()
    this.currentGame.end()
    this.end()
  }
  /**
   * game end proc
   */
  private end() {
    printLine('end game')
    process.exit()
  }
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
  private mode: Mode = 'normal'
  /**
   * initialize game
   */
  async setting() {
    this.mode = await promptSelect<Mode>('input mode', modes)
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
   * @param {string[]} input input string
   * @returns {{hit: number; blow: number}}hit: hit count, blow: blow count
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
   * @param {string[]} inputArr input string
   * @returns {boolean} true if validate
   */
  private validate(inputArr: string[]) {
    const isLengthValid = inputArr.length === this.answer.length
    const isAllAnswerSourceOption = inputArr.every((val) => this.answerSource.includes(val))
    const isAllDifferentValues = inputArr.every((val, i) => inputArr.indexOf(val) === i)
    return isLengthValid && isAllAnswerSourceOption && isAllDifferentValues
  }
  /**
   * get answer length
   * @returns {number} answer length
   */
  private getAnswerLength() {
    switch (this.mode) {
      case 'normal':
        return 3
      case 'hard':
        return 4
      case 'very hard':
        return 5
      default:
        const neverValue: never = this.mode
        throw new Error(`${neverValue} is disable mode`)
    }
  }
}
/**
 * IIFE
 */
; (async () => {
  new GameProcedure().start()
})()