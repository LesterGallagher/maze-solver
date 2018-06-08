
var imageInput = document.getElementById('image');
var canvas = document.getElementById('c');

export const fromFile = () => {
    var file = imageInput.files[0];
    if (!file) return alert('Can only reset when a file has been chosen');
    var fr = new FileReader();
    fr.onload = function () {
        let dataUrl = fr.result;
        let img = new Image();
        img.onload = function () {
            canvas.width = img.width;      // set canvas size big enough for the image
            canvas.height = img.height;
            var ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0);
            var event = document.createEvent('Event');
            event.initEvent('mazeimgloaded', true, true);
            document.dispatchEvent(event);
        };
        img.src = fr.result
    };
    fr.readAsDataURL(file);
}


imageInput.addEventListener('change', fromFile);

