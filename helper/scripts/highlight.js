
let target = document.querySelector('#rcnt')
target.style.borderColor = 'red';
target.style.borderStyle = 'solid';
var container = document.createElement('div');
container.style.position = 'relative'
var label = document.createElement('div');

label.textContent = 'My Label';
label.style.position = 'absolute';
label.style.top = '-40px';
label.style.left = '0';
label.style.borderColor = 'red';
label.style.borderStyle = 'solid';

container.insertBefore(label, container.firstChild)
target.insertBefore(container, target.firstChild);