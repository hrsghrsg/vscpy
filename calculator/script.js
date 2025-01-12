const display = document.getElementById('display');
const buttons = document.querySelectorAll('button');

buttons.forEach(button => {
  button.addEventListener('click', () => {
    const value = button.getAttribute('data-value');
    
    if (value === 'AC') {
      display.value = '0';
    } else if (value === 'DEL') {
      display.value = display.value.slice(0, -1) || '0';
    } else if (value === '=') {
      try {
        display.value = eval(display.value);
      } catch (error) {
        display.value = 'Error';
      }
    } else {
      if (display.value === '0') {
        display.value = value;
      } else {
        display.value += value;
      }
    }
  });
});
