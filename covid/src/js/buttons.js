export function getFullScreenButton() {
  const button = document.createElement('div');
  button.classList.add('pointer');
  const icon = document.createElement('i');
  icon.classList.add('bi', 'bi-fullscreen');
  icon.style = 'font-size: 2rem; color: #fff;';
  button.append(icon);
  button.addEventListener('click', () => {
    icon.classList.toggle('bi-fullscreen');
    icon.classList.toggle('bi-fullscreen-exit');
  });

  return button;
}

export function globe() {
  const button = document.createElement('div');
  const img = document.createElement('img');
  img.src = 'img/globe2.svg';
  button.append(img);
  button.classList.add('pointer');

  return button;
}

export function buttonGroup(array) {
  const group = document.createElement('div');
  group.classList.add('btn-group', 'statistic_buttons');
  group.setAttribute('role', 'group');
  group.setAttribute('aria-label', `${array.toString()}`);

  array.forEach((element, key) => {
    const input = document.createElement('input');
    input.classList.add('btn-check');
    input.setAttribute('type', 'radio');
    input.setAttribute('name', `btnradio-${array.toString()}`);
    input.setAttribute('autocomplete', 'off');
    if (key === 0) {
      input.setAttribute('checked', 'checked');
    }
    input.setAttribute('id', `${element}`);

    const label = document.createElement('label');

    label.classList.add('btn', 'btn-outline-primary');
    label.setAttribute('for', `${element}`);
    label.innerText = `${element}`;

    group.append(input);
    group.append(label);
  });

  return group;
}

export function keyboardButton() {
  const button = document.createElement('div');
  const img = document.createElement('img');
  img.src = 'img/keyboard.svg';
  button.append(img);
  button.classList.add('pointer', 'use-keyboard-input');

  return button;
}

export function resetInput() {
  const button = document.createElement('div');
  const img = document.createElement('img');
  img.src = 'img/x-square.svg';
  button.append(img);
  button.classList.add('pointer');

  return button;
}
