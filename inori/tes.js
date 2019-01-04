console.log('run in');

inoriInerval = setInterval(() => {
  const container = document.querySelector('.ql-container');
  if (!container || container.style.height > 500) {
    return;
  }
  container.style.height = container.children[0].scrollHeight + 'px'
}, 1000);