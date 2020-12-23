/* eslint-disable no-unused-expressions */
/* eslint-disable no-case-declarations */
/* eslint-disable no-useless-escape */
/* eslint-disable no-undef */
/* eslint-disable no-restricted-syntax */
/* eslint-disable max-len */
/* eslint-disable no-plusplus */
/* eslint-disable no-multi-assign */
/* eslint-disable camelcase */
/* eslint-disable no-underscore-dangle */
export default class Keyboard {
  constructor(parent) {
    this.parent = parent;
    this.elements = {
      main: null,
      keysContainer: null,
      keys: [],
      shift: null,
      en: null,
      ru: null,
      current: null,
      recognition: null,
    };
    this.eventHandlers = {
      oninput: null,
      onclose: null,
    };

    this.properties = {
      value: '',
      capsLock: false,
      shift: false,
      lang: 'en',
      cursorPosition: null,
      volume: true,
      voice: false,
      isKeyboardOpen: false,
    };
    this.init();
  }

  async init() {
    await this.parent;
    this.elements.main = document.createElement('div');
    this.elements.keysContainer = document.createElement('div');

    this.elements.main.classList.add('keyboard', 'keyboard--hidden');
    this.elements.keysContainer.classList.add('keyboard__keys');
    this.elements.keysContainer.appendChild(this._createKeys());

    this.elements.keys = this.elements.keysContainer.querySelectorAll('.keyboard__key');

    this.elements.main.appendChild(this.elements.keysContainer);
    document.body.appendChild(this.elements.main);

    this.elements.shift = document.querySelector('.shift');
    this.elements.en = document.getElementById('en');
    this.elements.ru = document.getElementById('ru');

    const event = new Event('input', {
      bubbles: true,
      cancelable: true,
    });

    document.querySelectorAll('.use-keyboard-input').forEach((element) => {
      element.addEventListener('click', () => {
        if (!this.properties.isKeyboardOpen) {
          this.open(this.parent.countries.search.value, (currentValue) => {
            this.parent.countries.search.value = currentValue;
            this.parent.countries.search.dispatchEvent(event);
          });
          this.elements.current = this.parent.countries.search;
          // this.properties.cursorPosition = this.elements.current.selectionStart;
          this.properties.isKeyboardOpen = true;
        } else if (this.properties.isKeyboardOpen) {
          this.close();
          this._triggerEvent('onclose');
          this.properties.isKeyboardOpen = false;
        }
      });
    });

    document.querySelectorAll('.search').forEach((element) => {
      element.addEventListener('keyup', () => {
        this.properties.value = element.value;
        // this.properties.cursorPosition = this.elements.current.selectionStart;
        this._triggerEvent('oninput');
      });
    });
  }

  _createKeys() {
    const fragment = document.createDocumentFragment();
    const keyLayout = [
      '`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'backspace',
      'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\',
      'caps', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'", 'enter',
      'Shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/',
      'voice', 'done', 'space', 'En/Ru', 'left', 'right', 'vol',
    ];

    const keyShiftLayout = [
      '~', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '+', 'backspace',
      'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '{', '}', '|',
      'caps', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ':', '"', 'enter',
      'Shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', '<', '>', '?',
      'voice', 'done', 'space', 'En/Ru', 'left', 'right', 'vol',
    ];
    const keyRuLayout = [
      'ё', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'backspace',
      'й', 'ц', 'у', 'к', 'е', 'н', 'г', 'ш', 'щ', 'з', 'х', 'ъ', '\\',
      'caps', 'ф', 'ы', 'в', 'а', 'п', 'р', 'о', 'л', 'д', 'ж', 'э', 'enter',
      'Shift', 'я', 'ч', 'с', 'м', 'и', 'т', 'ь', 'б', 'ю', '.',
      'voice', 'done', 'space', 'En/Ru', 'left', 'right', 'vol',
    ];
    const keyRuShiftLayout = [
      'Ё', '!', '"', '№', ';', '%', ':', '?', '*', '(', ')', '_', '+', 'backspace',
      'й', 'ц', 'у', 'к', 'е', 'н', 'г', 'ш', 'щ', 'з', 'х', 'ъ', '\\',
      'caps', 'ф', 'ы', 'в', 'а', 'п', 'р', 'о', 'л', 'д', 'ж', 'э', 'enter',
      'Shift', 'я', 'ч', 'с', 'м', 'и', 'т', 'ь', 'б', 'ю', ',',
      'voice', 'done', 'space', 'En/Ru', 'left', 'right', 'vol',
    ];

    const keyCodeLayout = [
      192, 49, 50, 51, 52, 53, 54, 55, 56, 57, 48, 189, 187, 8,
      81, 87, 69, 82, 84, 89, 85, 73, 79, 80, 219, 221, 220,
      20, 65, 83, 68, 70, 71, 72, 74, 75, 76, 186, 222, 13,
      16, 90, 88, 67, 86, 66, 78, 77, 188, 190, 191,
      'x', 'x', 32, 'x', 37, 39,
    ];

    document.querySelectorAll('.use-keyboard-input').forEach((element) => {
      element.addEventListener('keydown', (e) => {
        const ind = keyCodeLayout.indexOf(e.which);
        this.elements.keys[ind].classList.toggle('pressed');
      });
      element.addEventListener('keyup', (e) => {
        const ind = keyCodeLayout.indexOf(e.which);
        this.elements.keys[ind].classList.toggle('pressed');
      });
    });

    const createIconHTML = (icon_name) => `<i class="material-icons">${icon_name}</i>`;

    keyLayout.forEach((key) => {
      const keyElement = document.createElement('button');
      const insertLineBreak = ['backspace', '\\', 'enter', '\/'].indexOf(key) !== -1;

      keyElement.setAttribute('type', 'button');
      keyElement.classList.add('keyboard__key');

      switch (key) {
        case 'backspace':
          keyElement.classList.add('keyboard__key--wide');
          keyElement.innerHTML = createIconHTML('backspace');

          keyElement.addEventListener('click', () => {
            this.properties.value = this.insertInCur('backspace');
            this._triggerEvent('oninput');
            this.elements.current.selectionStart = this.elements.current.selectionEnd = this.properties.cursorPosition;
            this.playSound('snare');
          });

          break;

        case 'caps':
          keyElement.classList.add('keyboard__key--wide', 'keyboard__key--activatable');
          keyElement.innerHTML = createIconHTML('keyboard_capslock');

          keyElement.addEventListener('click', () => {
            this._toggleCapsLock();
            keyElement.classList.toggle('keyboard__key--active', this.properties.capsLock);
          });

          break;

        case 'Shift':
          keyElement.classList.add('keyboard__key--wide', 'keyboard__key--activatable', 'shift');
          keyElement.innerHTML = '<span>Shift</span>';
          keyElement.addEventListener('click', () => {
            this._toggleShift();
          });

          break;

        case 'En/Ru':
          keyElement.classList.add('keyboard__key--wide');
          keyElement.innerHTML = "<span id='en' class='lang__key--active'>En </span> | <span id='ru'> Ru</span>";
          keyElement.addEventListener('click', () => {
            this._toggleLang();
            this.playSound('boom');
          });

          break;
        case 'enter':
          keyElement.classList.add('keyboard__key--wide');
          keyElement.innerHTML = createIconHTML('keyboard_return');

          keyElement.addEventListener('click', () => {
            this.properties.value = this.insertInCur('\n');
            this._triggerEvent('oninput');
            this.elements.current.selectionStart = this.elements.current.selectionEnd = this.properties.cursorPosition; // ----set cursor position----
            this.playSound('tom');
          });
          break;

        case 'space':
          keyElement.classList.add('keyboard__key--extra-wide');
          keyElement.innerHTML = createIconHTML('space_bar');

          keyElement.addEventListener('click', () => {
            this.properties.value = this.insertInCur(' ');
            this._triggerEvent('oninput');
            this.elements.current.selectionStart = this.elements.current.selectionEnd = this.properties.cursorPosition; // ----set cursor position----
            this.playSound('boom');
          });

          break;

        case 'left':
          keyElement.classList.add('keyboard__key');
          keyElement.innerHTML = createIconHTML('arrow_back');

          keyElement.addEventListener('click', () => {
            this.elements.current.selectionStart = this.elements.current.selectionEnd = --this.properties.cursorPosition; // ----set cursor position----
            this._triggerEvent('oninput');
            this.elements.current.focus();
            this.playSound('boom');
          });

          break;

        case 'right':
          keyElement.classList.add('keyboard__key');
          keyElement.innerHTML = createIconHTML('arrow_forward');

          keyElement.addEventListener('click', () => {
            this.elements.current.selectionStart = this.elements.current.selectionEnd = ++this.properties.cursorPosition; // ----set cursor position----
            this._triggerEvent('oninput');
            this.elements.current.focus();
            this.playSound('boom');
          });

          break;

        case 'done':
          keyElement.classList.add('keyboard__key--wide', 'keyboard__key--dark');
          keyElement.innerHTML = createIconHTML('check_circle');

          keyElement.addEventListener('click', () => {
            this.close();
            this._triggerEvent('onclose');
          });

          break;

        case 'vol':
          keyElement.classList.add('volume');
          keyElement.innerHTML = createIconHTML('volume_up');

          keyElement.addEventListener('click', () => {
            this.properties.volume = !this.properties.volume;
            if (this.properties.volume) {
              keyElement.innerHTML = createIconHTML('volume_up');
            } else {
              keyElement.innerHTML = createIconHTML('volume_off');
            }
            this.elements.current.focus();
          });
          break;

        case 'voice':
          keyElement.classList.add('voice');
          keyElement.innerHTML = createIconHTML('keyboard_voice');

          keyElement.addEventListener('click', () => {
            this.properties.voice = !this.properties.voice;
            keyElement.classList.toggle('voice_active');

            this.voiceRecognition();
            this.elements.current.focus();
          });
          break;

        default:
          keyElement.textContent = key.toLowerCase();
          keyElement.defCase = key.toLocaleLowerCase();

          if (key.search(/[a-z]/) !== -1) {
            keyElement.shiftCase = key.toUpperCase();
          } else {
            keyElement.shiftCase = keyShiftLayout[keyLayout.indexOf(key)];
          }

          const keyRu = keyRuLayout[keyLayout.indexOf(key)];
          keyElement.ruCase = keyRu;
          if (keyRu.search(/[а-я]/) !== -1) {
            keyElement.shiftRuCase = keyRu.toUpperCase();
          } else {
            keyElement.shiftRuCase = keyRuShiftLayout[keyLayout.indexOf(key)];
          }

          keyElement.addEventListener('click', () => {
            const val = (this.properties.capsLock && !this.properties.shift) ? keyElement.textContent.toUpperCase() : keyElement.textContent;
            this.properties.value = this.insertInCur(val);

            this._triggerEvent('oninput');
            this.elements.current.focus();
            this.elements.current.selectionStart = this.elements.current.selectionEnd = this.properties.cursorPosition; // ----set cursor position----

            this.properties.lang === 'en' ? this.playSound('boom') : this.playSound('tink');
          });

          break;
      }

      fragment.appendChild(keyElement);

      if (insertLineBreak) {
        fragment.appendChild(document.createElement('br'));
      }
    });
    const sounds = ['boom', 'clap', 'kick', 'snare', 'tink', 'tom'];
    sounds.forEach((el) => {
      const audio = document.createElement('audio');
      audio.setAttribute('src', `audio/${el}.wav`);
      audio.setAttribute('id', `${el}`);
      fragment.appendChild(audio);
    });

    return fragment;
  }

  _triggerEvent(handlerName) {
    if (typeof this.eventHandlers[handlerName] === 'function') {
      this.eventHandlers[handlerName](this.properties.value);
      this.elements.current.focus();
    }
  }

  _toggleCapsLock() {
    this.properties.capsLock = !this.properties.capsLock;

    if (this.properties.lang === 'en') {
      for (const key of this.elements.keys) {
        if (key.childElementCount === 0) {
          if (this.properties.capsLock && !this.properties.shift) {
            key.textContent = key.textContent.toUpperCase();
          } else if (!this.properties.capsLock && this.properties.shift) {
            key.textContent = key.shiftCase;
          } else {
            key.textContent = key.textContent.toLowerCase();
          }
        }
      }
    } else if (this.properties.lang === 'ru') {
      for (const key of this.elements.keys) {
        if (key.childElementCount === 0) {
          if (this.properties.capsLock && !this.properties.shift) {
            key.textContent = key.textContent.toUpperCase();
          } else if (!this.properties.capsLock && this.properties.shift) {
            key.textContent = key.shiftRuCase;
          } else {
            key.textContent = key.textContent.toLowerCase();
          }
        }
      }
    }
    this.elements.current.focus();

    this.playSound('clap');
  }

  _toggleShift() {
    this.properties.shift = !this.properties.shift;
    this.elements.shift.classList.toggle('keyboard__key--active', this.properties.shift);

    if (this.properties.lang === 'en') {
      for (const key of this.elements.keys) {
        if (key.childElementCount === 0) {
          if (this.properties.shift && !this.properties.capsLock) {
            key.textContent = key.shiftCase;
          } else if (!this.properties.shift && this.properties.capsLock) {
            key.textContent = key.textContent.toUpperCase();
          } else {
            key.textContent = key.defCase;
          }
        }
      }
    } else if (this.properties.lang === 'ru') {
      for (const key of this.elements.keys) {
        if (key.childElementCount === 0) {
          if (this.properties.shift && !this.properties.capsLock) {
            key.textContent = key.shiftRuCase;
          } else if (!this.properties.shift && this.properties.capsLock) {
            key.textContent = key.textContent.toUpperCase();
          } else {
            key.textContent = key.ruCase;
          }
        }
      }
    }
    this.elements.current.focus();

    this.playSound('kick');
  }

  _toggleLang() {
    if (this.properties.lang === 'en') {
      this.properties.lang = 'ru';

      this.elements.en.classList.remove('lang__key--active');
      this.elements.ru.classList.add('lang__key--active');

      for (const key of this.elements.keys) {
        if (key.childElementCount === 0) {
          key.textContent = this.properties.shift ? key.shiftRuCase : key.ruCase;
        }
      }
    } else if (this.properties.lang === 'ru') {
      this.properties.lang = 'en';

      this.elements.en.classList.add('lang__key--active');
      this.elements.ru.classList.remove('lang__key--active');

      for (const key of this.elements.keys) {
        if (key.childElementCount === 0) {
          key.textContent = this.properties.shift ? key.shiftCase : key.defCase;
        }
      }
    }
    this.elements.current.focus();

    this.playSound('tink');
  }

  insertInCur(val) {
    let tmp;
    if (val === 'backspace') {
      if (this.properties.cursorPosition !== 0) {
        tmp = this.properties.value.slice(0, this.properties.cursorPosition - 1) + this.properties.value.slice(this.properties.cursorPosition);
        this.properties.cursorPosition--; // ----set cursor position----
      }
    } else {
      tmp = this.properties.value.slice(0, this.properties.cursorPosition) + val + this.properties.value.slice(this.properties.cursorPosition);
      this.properties.cursorPosition += 1; // ----set cursor position----
    }
    this.elements.current.selectionStart = this.elements.current.selectionEnd = this.properties.cursorPosition; // ----set cursor position----

    return tmp;
  }

  playSound(id) {
    if (this.properties.volume) {
      const audio = document.getElementById(`${id}`);
      audio.currentTime = 0;
      audio.play();
    }
  }

  voiceRecognition() {
    if (this.properties.voice) {
      window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

      this.elements.recognition = new SpeechRecognition();
      this.elements.recognition.interimResults = true;
      if (this.properties.lang === 'en') {
        this.elements.recognition.lang = 'en-US';
      } else if (this.properties.lang === 'ru') {
        this.elements.recognition.lang = 'ru';
      }

      this.elements.recognition.addEventListener('result', (e) => {
        const transcript = Array.from(e.results).map((result) => result[0]).map((result) => result.transcript).join('');
        if (e.results[0].isFinal) {
          this.properties.value += transcript[0].toUpperCase() + transcript.slice(1);
          this._triggerEvent('oninput');
        }
      });

      this.elements.recognition.addEventListener('end', this.elements.recognition.start);
      this.elements.recognition.start();
    } else {
      this.elements.recognition.abort();
      this.elements.recognition.removeEventListener('end', this.elements.recognition.start);
      this.properties.value = '';
    }
  }

  open(initialValue, oninput, onclose) {
    this.properties.value = initialValue || '';
    this.eventHandlers.oninput = oninput;
    this.eventHandlers.onclose = onclose;
    this.elements.main.classList.remove('keyboard--hidden');
  }

  close() {
    this.properties.value = '';
    this.eventHandlers.oninput = oninput;
    this.eventHandlers.onclose = onclose;
    this.elements.main.classList.add('keyboard--hidden');
  }
}
