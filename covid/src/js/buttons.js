export function fullScreenButton() {
  const button = document.createElement("div");
  const i = document.createElement("i");
  i.classList.add('bi', 'bi-fullscreen', 'pointer');
  i.style = "font-size: 2rem; color: #fff;";
  button.append(i);
  button.addEventListener("click", () => {
    i.classList.toggle("bi-fullscreen");
    i.classList.toggle("bi-fullscreen-exit");
  });

  return button;
}

export function globe() {
    const button = document.createElement("div");
    const img = document.createElement("img");
    img.src = 'img/globe2.svg';
    button.append(img);
    button.classList.add('pointer');

    return button;
  }

export function buttonGroup(array) {
  let group = document.createElement("div");
  group.classList.add('btn-group', 'statistic_buttons');
  group.setAttribute("role", "group");
  group.setAttribute('aria-label', `${array.toString()}`);

  array.forEach((element, key) => {
    let input = document.createElement("input");
    input.classList.add("btn-check");
    input.setAttribute("type", "radio");
    input.setAttribute("name", `btnradio-${array.toString()}`);
    input.setAttribute("autocomplete", "off");
    if(key === 0) {
    input.setAttribute("checked", "checked");
    }
    input.setAttribute("id", `${element}`);

    let label = document.createElement('label');
   
    label.classList.add('btn', 'btn-outline-primary');
    label.setAttribute('for', `${element}`);
    label.innerText = `${element}`;
    
    group.append(input);
    group.append(label);
  });
  
  return group;
}
