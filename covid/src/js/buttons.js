export function fullScreenButton() {
  const button = document.createElement("div");
  const i = document.createElement("i");
  i.classList.add("bi", "bi-fullscreen");
  i.style = "font-size: 2rem; color: #fff;";
  button.append(i);
  button.addEventListener("click", () => {
    i.classList.toggle("bi-fullscreen");
    i.classList.toggle("bi-fullscreen-exit");
  });

  return button;
}

export function buttonGroup(array) {
  let group = document.createElement("div");
  group.classList.add('btn-group', 'statistic_buttons');
  group.setAttribute("role", "group");
  group.setAttribute('aria-label', "Basic radio toggle button group");

  array.forEach((element, key) => {
    let input = document.createElement("input");
    input.classList.add("btn-check");
    input.setAttribute("type", "radio");
    input.setAttribute("name", "btnradio");
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
