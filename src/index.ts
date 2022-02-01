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
  answerSource = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
  /**
   * set answer item
   */
  answer: string[] = []
  /**
   * game try count
   */
  tryCount = 0
  /**
   * initialize game
   */
  setting() {
    const answerLength = 3
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
    const inputArr = (await promptInput('input 3 num separate ,')).split(',')

  }
}
/**
 * IIFE
 */
; (async () => {
  const hitAndBlow = new HitAndBlow()
  hitAndBlow.setting()
  await hitAndBlow.play()
})()