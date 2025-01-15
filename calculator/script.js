document.addEventListener('DOMContentLoaded', () => {
  const display = document.getElementById('display');
  const expression = document.getElementById('expression');
  const buttons = document.querySelectorAll('button');
  let currentMode = 'rad';
  let lastResult = null;

  function calculate(expr) {
    // 替换数学常数
    expr = expr.replace(/π/g, 'Math.PI')
               .replace(/e/g, 'Math.E');

    try {
      // 处理特殊函数
      if (expr.includes('sin(')) {
        const angle = parseFloat(expr.match(/sin\((.*?)\)/)[1]);
        return Math.sin(currentMode === 'deg' ? angle * Math.PI / 180 : angle);
      }
      if (expr.includes('cos(')) {
        const angle = parseFloat(expr.match(/cos\((.*?)\)/)[1]);
        return Math.cos(currentMode === 'deg' ? angle * Math.PI / 180 : angle);
      }
      if (expr.includes('tan(')) {
        const angle = parseFloat(expr.match(/tan\((.*?)\)/)[1]);
        return Math.tan(currentMode === 'deg' ? angle * Math.PI / 180 : angle);
      }
      if (expr.includes('log(')) {
        return Math.log10(parseFloat(expr.match(/log\((.*?)\)/)[1]));
      }
      if (expr.includes('ln(')) {
        return Math.log(parseFloat(expr.match(/ln\((.*?)\)/)[1]));
      }
      if (expr.includes('sqrt(')) {
        return Math.sqrt(parseFloat(expr.match(/sqrt\((.*?)\)/)[1]));
      }
      if (expr.includes('!')) {
        const num = parseInt(expr);
        let result = 1;
        for (let i = 2; i <= num; i++) result *= i;
        return result;
      }

      return eval(expr);
    } catch (error) {
      return 'Error';
    }
  }

  // 处理按钮点击
  buttons.forEach(button => {
    button.addEventListener('click', () => {
      const value = button.getAttribute('data-value');
      const mode = button.getAttribute('data-mode');

      if (mode) {
        // 切换角度/弧度模式
        document.querySelectorAll('.mode-btn').forEach(btn => {
          btn.classList.toggle('active', btn.getAttribute('data-mode') === mode);
        });
        currentMode = mode;
        return;
      }

      if (value === 'AC') {
        display.value = '0';
        expression.textContent = '';
        lastResult = null;
      } else if (value === 'DEL') {
        display.value = display.value.slice(0, -1) || '0';
      } else if (value === '=') {
        const result = calculate(display.value);
        expression.textContent = display.value + ' =';
        display.value = result;
        lastResult = result;
      } else if (['sin', 'cos', 'tan', 'log', 'ln', 'sqrt'].includes(value)) {
        display.value = value + '(' + (display.value === '0' ? '' : display.value) + ')';
      } else if (value === 'square') {
        display.value = `(${display.value})²`;
      } else if (value === 'factorial') {
        display.value = `${display.value}!`;
      } else if (value === 'inverse') {
        display.value = `1/(${display.value})`;
      } else if (value === 'pi') {
        display.value = display.value === '0' ? 'π' : display.value + 'π';
      } else {
        if (display.value === '0' && value !== '.') {
          display.value = value;
        } else {
          display.value += value;
        }
      }
    });
  });

  // 添加键盘支持
  document.addEventListener('keydown', (e) => {
    const key = e.key;
    if (/[\d\+\-\*\/\.\(\)]/.test(key)) {
      e.preventDefault();
      const button = document.querySelector(`button[data-value="${key}"]`);
      if (button) button.click();
    } else if (key === 'Enter') {
      e.preventDefault();
      document.querySelector('button[data-value="="]').click();
    } else if (key === 'Backspace') {
      e.preventDefault();
      document.querySelector('button[data-value="DEL"]').click();
    } else if (key === 'Escape') {
      e.preventDefault();
      document.querySelector('button[data-value="AC"]').click();
    }
  });
});
