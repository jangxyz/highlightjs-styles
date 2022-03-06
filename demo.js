hljs.debugMode();
hljs.highlightAll();

// editable
function styleObjectToString(styleObj) {
  return Object.entries(styleObj)
    .map(([key, value]) => {
      const value2 = Number.isFinite(value) ? `${value}px` : value;
      return `${key}:${value2}`;
    })
    .join('; ');
}
document.querySelectorAll('code').forEach((code) => {
  code.addEventListener('dblclick', (event) => {
    initializeEdit();

    function initializeEdit() {
      const rect = code.getBoundingClientRect();
      console.log('dblclick', event.target, { event, rect });
      const container = document.createElement('div');
      const textarea = (() => {
        const textarea = document.createElement('textarea');
        const originalContent = code.textContent;
        textarea.value = originalContent;
        textarea.setAttribute(
          'style',
          styleObjectToString({
            position: 'absolute',
            top: code.offsetTop,
            left: code.offsetLeft,
            //top: rect.top,
            //left: rect.left,
            width: rect.width,
            height: rect.height,
            //
            display: 'block',
            'box-sizing': 'border-box',
            'font-family': 'Consolas, Monaco, monospace',
            'font-size': '10pt',
            'overflow-x': 'auto',
            //padding: '0.5em',
            padding: '1em',
            'scrollbar-width': 'thin',
            'tab-size': '4',
            '-moz-tab-size': '4',
          })
        );
        textarea.addEventListener('keydown', (event) => {
          const { key, metaKey } = event;
          if (key === 'Enter' && metaKey) {
            //console.log('Enter', key, event);
            saveChange();
            finishEdit();
          }
        });
        return textarea;
      })();
      const buttons = (() => {
        const row = document.createElement('div');
        row.setAttribute(
          'style',
          styleObjectToString({
            position: 'absolute',
            //bottom: '-20px',
            top: code.offsetTop + rect.height,
          })
        );

        const saveButton = document.createElement('button');
        saveButton.textContent = 'Save';
        saveButton.addEventListener('click', (event) => {
          event.preventDefault();
          saveChange();
          finishEdit();
        });
        const cancelButton = document.createElement('button');
        cancelButton.textContent = 'Cancel';
        cancelButton.addEventListener('click', (event) => {
          event.preventDefault();
          cancelChange();
          finishEdit();
        });

        row.appendChild(saveButton);
        row.appendChild(cancelButton);
        return row;
      })();
      container.appendChild(textarea);
      container.appendChild(buttons);
      //
      code.parentElement.appendChild(container);

      function saveChange() {
        code.textContent = textarea.value;
        //hljs.highlightAll()
        hljs.highlightElement(code);
      }
      function cancelChange() {
        code.textContent = originalContent;
        //hljs.highlightAll()
        hljs.highlightElement(code);
      }
      function finishEdit() {
        container.parentElement.removeChild(container);
      }
    }
  });
});
document.body.addEventListener('keydown', (event) => {
  const { key, target, currentTarget } = event;
  if (['TEXTAREA', 'INPUT'].includes(target.tagName)) {
    return;
  }

  if (key === 'Enter') {
    const currentStyle = document.querySelector('.styles .current');
    const currentStyleName = currentStyle.textContent;
    console.log(currentStyleName);
  }

  if (!key.startsWith('Arrow')) {
    return;
  }

  if (key === 'ArrowDown') {
    const currentStyle = document.querySelector('.styles .current');
    const nextStyle =
      currentStyle.parentElement.nextElementSibling.querySelector('a');
    if (nextStyle) {
      currentStyle.classList.remove('current');
      nextStyle.classList.add('current');
      //nextStyle.parentElement.parentElement.scrollTop =
      nextStyle.scrollIntoView();
      renderStyle();
    }
  } else if (key === 'ArrowUp') {
    const currentStyle = document.querySelector('.styles .current');
    const nextStyle =
      currentStyle.parentElement.previousElementSibling.querySelector('a');
    if (nextStyle) {
      currentStyle.classList.remove('current');
      nextStyle.classList.add('current');
      nextStyle.scrollIntoView();
      renderStyle();
    }
  }
});

// categories: select one type
document.querySelectorAll('.categories li a').forEach((category) => {
  category.addEventListener('click', (event) => {
    event.preventDefault();

    const current = document.querySelector('.categories .current');
    const currentCategory = current.dataset.category;
    const nextCategory = event.target.dataset.category;

    if (currentCategory !== nextCategory) {
      current.classList.remove('current');
      event.target.classList.add('current');

      document
        .querySelectorAll(`.${currentCategory}`)
        .forEach((language) => language.classList.add('hidden'));
      document
        .querySelectorAll(`.${nextCategory}`)
        .forEach((language) => language.classList.remove('hidden'));

      window.scrollTo(0, 0);
    }
  });
});

// languages: checkbox type
function renderLanguages() {
  const currents = document.querySelectorAll('.languages .current');
  const currentLanguages = [...currents].map((node) => node.dataset.language);

  if (currentLanguages.length > 0) {
    document
      .querySelectorAll(`code[class*="language-"]`)
      .forEach((code) =>
        code.parentElement.parentElement.classList.add('hidden')
      );
    currentLanguages.forEach((language) => {
      const codeElement = document.querySelector(
        `code[class*="language-${language} "]`
      );
      if (codeElement) {
        codeElement.parentElement.parentElement.classList.remove('hidden');
      }
    });
  } else {
    document
      .querySelectorAll(`code[class*="language-"]`)
      .forEach((code) =>
        code.parentElement.parentElement.classList.remove('hidden')
      );
  }
}
document.querySelectorAll('.languages li a').forEach((category) => {
  category.addEventListener('click', (event) => {
    event.preventDefault();

    const currents = document.querySelectorAll('.languages .current');
    const currentLanguages = [...currents].map((node) => node.dataset.language);
    const nextLanguage = event.target.dataset.language;

    if (currentLanguages.includes(nextLanguage)) {
      event.target.classList.remove('current');
      currentLanguages.splice(currentLanguages.indexOf(nextLanguage), 1);
    } else {
      currentLanguages.push(nextLanguage);
      event.target.classList.add('current');
    }

    //
    renderLanguages();

    //
    window.scrollTo(0, 0);
  });
});
renderLanguages();

// styles
function renderStyle() {
  const currentStyle = document.querySelector('.styles .current').textContent;

  // reset
  document
    .querySelectorAll(`link[title]`)
    .forEach((node) => node.setAttribute('disabled', 'disabled'));
  //
  document
    .querySelector(`link[title="${currentStyle}"]`)
    .removeAttribute('disabled');
}
document.querySelectorAll('.styles li a').forEach((style) => {
  style.addEventListener('click', (event) => {
    event.preventDefault();

    const currentStyle = document.querySelector('.styles .current');
    const currentStyleName = currentStyle.textContent;
    const nextStyleName = event.target.textContent;

    if (currentStyleName !== nextStyleName) {
      currentStyle.classList.remove('current');
      event.target.classList.add('current');

      renderStyle();
    }
  });
});
