var t = new Trianglify();
var width = parseInt($("#bg-width").val());
var height = parseInt($("#bg-height").val());
var pattern = t.generate(width, height);
document.body.setAttribute('style', 'background-image: '+pattern.dataUrl);
