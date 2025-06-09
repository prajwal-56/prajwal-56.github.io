// ——————————————————————————————————————————————————
// TextScramble
// ——————————————————————————————————————————————————

class TextScramble {
  constructor(el) {
    this.el = el
    this.chars = '!<>-_\\/[]{}—=+*^?#________@().'
    this.update = this.update.bind(this)
  }
  setText(newText) {
    const oldText = this.el.innerText
    const length = Math.max(oldText.length, newText.length)
    const promise = new Promise((resolve) => this.resolve = resolve)
    this.queue = []
    for (let i = 0; i < length; i++) {
      const from = oldText[i] || ''
      const to = newText[i] || ''
      const start = Math.floor(Math.random() * 40)
      const end = start + Math.floor(Math.random() * 40)
      this.queue.push({ from, to, start, end })
    }
    cancelAnimationFrame(this.frameRequest)
    this.frame = 0
    this.update()
    return promise
  }
  update() {
    let output = ''
    let complete = 0
    for (let i = 0, n = this.queue.length; i < n; i++) {
      let { from, to, start, end, char } = this.queue[i]
      if (this.frame >= end) {
        complete++
        output += to
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.28) {
          char = this.randomChar()
          this.queue[i].char = char
        }
        output += `<span class="dud">${char}</span>`
      } else {
        output += from
      }
    }
    this.el.innerHTML = output
    if (complete === this.queue.length) {
      this.resolve()
    } else {
      this.frameRequest = requestAnimationFrame(this.update)
      this.frame++
    }
  }
  randomChar() {
    return this.chars[Math.floor(Math.random() * this.chars.length)]
  }
}

// text 

const phrases = [
  'Neo,',
  'sooner or later',
  'you\'re going to realize',
  'just as I did',
  'that there\'s a difference',
  'between knowing the path',
  'and walking the path <br> - Morpheus',
  [' this' , 'is' , 'a test' , 'for a' , 'nested list or whatever it is']
]

const whoAmi = [
    'Prajwal',
    'Programmer',
    'Science Enthusiast',
    'Engineer Undergrad',
    'Skeptical',
    'Cinephile'
]

const things_i_do = [
    'Write code in Python , Java , C. (I also write small scripts in bash, pwsh,... )' ,
    'Also do some basic web-dev' ,
    'Mess with my Computer all day',
    'Build random things',
    'Watch Movies (I Love it)',
    'Put my brain into Default Mode'
]

const el = document.querySelector('.glitchText')
const fx = new TextScramble(el)

let counter = 0
const morpheus_said = () => {
  fx.setText(phrases[counter]).then(() => {
    setTimeout(morpheus_said, 800)
  })
  counter = (counter + 1) % phrases.length
}

// morpheus_said()


// ________________For the I am Heading/title/.... _____________ 
const elm = document.querySelector('.iAm')
const fx1 = new TextScramble(elm)


let counterForIam = 0
const my_characteristics = () => {
  fx1.setText(whoAmi[counterForIam]).then(() => {
    setTimeout(my_characteristics, 800)
  })
  counterForIam = (counterForIam + 1) % whoAmi.length
}

my_characteristics()

// ___________ what I Do________
const elm2 = document.querySelector('.iDo')
const fx2 = new TextScramble(elm2)

let counterForWhatIDo = 0
const whatIDo = () => {
  fx2.setText(things_i_do[counterForWhatIDo]).then(() => {
    setTimeout(whatIDo, 3000)
  })
  counterForWhatIDo = (counterForWhatIDo + 1) % things_i_do.length
}

whatIDo()