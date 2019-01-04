(function () {

  const suggestTypes = {
    time: '120',
    date: '100',
  };

  const suggestFields = {
    '人': '100',
    '职务': '100',
    '岗位': '100'
  };


  const elId = 'kye-enhance-container';
  const mainButtonElId = 'kye-enhance-main-button';
  const panelId = 'kye-enhance-panel';
  const fetchDataButtonId = 'fetchDataButtonId';
  const exportDataButtonId = 'exportDataButtonId';
  const tableId = 'tableId'

  let el;
  let buttonEl;
  let panelEl;
  let fetchButtonEl;
  let exportButtonEl;
  let tableEl;
  let jsonData;

  function isElementExist(id) {
    return document.getElementById(id)
  }

  /**
   * createElement
   * @param tag
   * @param styleOption
   * @param attrs
   * @returns {HTMLElement}
   */
  const createElement = function (tag, styleOption = {}, attrs = {}) {
    const temp = document.createElement(tag);
    Object.keys(styleOption).forEach(function (key) {
      temp.style[key] = styleOption[key]
    });
    Object.keys(attrs).forEach(function (key) {
      temp.setAttribute(key, attrs[key])
    });
    return temp
  };

  /**
   * getTableHeader
   */
  function getTableHeader() {
    const fields = ['label', 'show', 'width', 'type', 'suggest width']
    let result = `<tr>`;
    fields.forEach(function (field) {
      result += `<th>${field}</th>`
    });
    result += `</tr>`;
    return result;
  }


  /**
   *
   */
  function init() {
    el = createElement('div', {}, {
      id: elId,
    });
    el.setAttribute('class', 'y-fix-container')
    el.innerHTML = `
       <div id="${panelId}" class="y-panel" style="display: none">
            <div class="y-action-button-container">
                <button id="${fetchDataButtonId}">Fetch Data</button>
                <button id="${exportDataButtonId}">Update Date</button>
            </div>
            <div>
                <table id="${tableId}" class="y-table">
                    ${getTableHeader()}
                </table>
            </div>
        </div>
      <div class="y-main-button" id="${mainButtonElId}">
       Toggle
       </div>
    `;
    document.body.appendChild(el);

    buttonEl = isElementExist(mainButtonElId);
    panelEl = isElementExist(panelId);
    fetchButtonEl = isElementExist(fetchDataButtonId);
    exportButtonEl = isElementExist(exportDataButtonId);
    tableEl = isElementExist(tableId);

    buttonEl.addEventListener('click', togglePanel);
    fetchButtonEl.addEventListener('click', fetchData)
    exportButtonEl.addEventListener('click', exportData)
  }

  function exportData() {
    const list = tableEl.querySelectorAll('input')
    list.forEach(function (d, index) {
      const value = Number(d.value)
      const temp = jsonData[index];
      temp.width = value;
      jsonData.splice(index, 1, temp)
    });
    const str = JSON.stringify(jsonData)
    const dialog = document.querySelector('[aria-label=修改模板配置]')
    if (dialog) {
      const textEl = dialog.querySelector('textarea')
      if (textEl) {
        textEl.value = str
      }
    }
  }


  function getSuggest({label, type}, width) {
    if (suggestTypes[type]) {
      return suggestTypes[type]
    }
    const selectKey = Object.keys(suggestFields)
      .find(function (key) {
        return label.indexOf(key) !== -1
      });
    if (selectKey) {
      return suggestFields[selectKey];
    }
    return Number(width)
  }


  function generateDataStr(data) {
    return data.map(function (item) {
      const width = Number(`${item.width}`.replace('px', ''))
      const suggestWidth = getSuggest(item, width);

      return `
        <tr class="${suggestWidth !== width ? 'y-change-td' : ''} ${!item.show ? 'y-blcok-item' : ''}">
            <td>${item.label}</td>
            <td>${item.show}</td>
            <td>${width}</td>
            <td>${item.type || ''}</td>
            <td >
                <input value="${suggestWidth}"/>
            </td>
        </tr>
      `
    }).join('')
  }


  function fillTableWithData(data) {
    tableEl.innerHTML = `
      ${getTableHeader()}
      ${generateDataStr(data)}
    `
  }

  function fetchData() {
    const dialog = document.querySelector('[aria-label=修改模板配置]')
    if (dialog) {
      const textEl = dialog.querySelector('textarea')
      if (textEl) {
        const jsonValue = JSON.parse(textEl.value)
        jsonData = [...jsonValue];
        fillTableWithData(jsonValue.map(function (item) {
          return {
            ...item,
            type: item.filter && item.filter.type || ''
          }
        }))
      }
    }
  }


  function togglePanel() {
    if (panelEl.style.display === 'none') {
      panelEl.style.display = 'flex';
    } else {
      panelEl.style.display = 'none';
    }
  }


  chrome.runtime.onMessage.addListener(
    function (request) {
      if (request.message === 'hello!') {
        console.log(request.url);
        if (request.url === 'http://xx') {
          if (!isElementExist(elId)) {
            init()
          }
        } else {
          // removeTable()
        }
      }
    });
})();
