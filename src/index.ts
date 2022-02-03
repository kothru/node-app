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
  return readLine()
}
/**
 * prompt stdin input select only values
 * @param text print prompt text
 * @param values select list
 * @returns select value
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
 * @returns read line string
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
 * next action array
 */
const nextActions = ['play again', 'exit'] as const
/**
 * next action type
 */
type NextAction = typeof nextActions[number]
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

    const action = await promptSelect<NextAction>('continue?', nextActions)
    if (action === 'play again') {
      await this.play()
    } else if (action === 'exit') {
      this.end()
    } else {
      const neverValue: never = action
      throw new Error(`${neverValue} is an invalid action`)
    }
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
   * @returns answer length
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
        throw new Error(`${neverValue} is invalid mode`)
    }
  }
}
/**
 * IIFE
 */
; (async () => {
  new GameProcedure().start()
})()