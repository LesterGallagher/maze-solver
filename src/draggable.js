
var draggables = document.getElementsByClassName('draggable');
var el = document.getElementById('c');
var mousedown = false;
var target;

document.addEventListener('mousedown', function (e) {
    if (e.target.hasAttribute('class') && e.target.getAttribute('class').indexOf('draggable') === -1) return;
    mousedown = true;
    target = e.target;
});

document.addEventListener('mouseup', function (e) {
    if (e.target.hasAttribute('class') && e.target.getAttribute('class').indexOf('draggable') === -1) return;
    mousedown = false;
});

document.addEventListener('mousemove', function (e) {
    if (mousedown === false) return;
    var rect = el.getBoundingClientRect();
    var x = Math.max(rect.left, Math.min(rect.right, e.clientX)) + document.documentElement.scrollLeft;
    var y = Math.max(rect.top, Math.min(rect.bottom, e.clientY)) + document.documentElement.scrollTop;
    target.style.left = x - 20 + 'px';
    target.style.top = y - 20 + 'px';
});

