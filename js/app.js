var currentTrianglifier;
var currentPattern;

var palettes = [];
var currentXPalette;
var currentYPalette;

var NO_OF_PALETTES_TO_RETRIEVE = 100;

var triOptions = {
  width: function() {
    return parseInt($("#bg-width").val());
  },
  height: function() {
    return parseInt($("#bg-height").val());
  },
  cellSize: function(){
    return $('#cell-slider').slider("value");
  },
  noise: function(){
    return $('#noise-slider').slider("value");
  },
  xColors: function(){
    return currentXPalette.colors;
  },
  yColors: function(){
    return currentYPalette.colors;
  }
};

initiateSliders();
getColourSchemes(NO_OF_PALETTES_TO_RETRIEVE);

function setNewTrianglifier() {
  currentTrianglifier = new Trianglify({"noiseIntensity": triOptions.noise(),
                          "cellsize": triOptions.cellSize(),
                          "x_gradient": triOptions.xColors(),
                          "y_gradient": triOptions.yColors()
                        });
}

$("#generate").on('click', function() {
  setNewTrianglifier();
  generateBackground();
});

$("#download").on('click', function() {
  convertSVGtoPNG();
});

function generateBackground() {
  currentPattern = currentTrianglifier.generate(triOptions.width(), triOptions.height());
  $("#backgrounds").css({"background-image": currentPattern.dataUrl});
  convertSVGtoPNG();
}

function convertSVGtoPNG() {
  var canvas = document.getElementById('the-canvas');
  var context = canvas.getContext('2d');
  canvas.width = triOptions.width();
  canvas.height = triOptions.height();

  var image = new Image();

  image.addEventListener("load", function() {
                  context.drawImage(image, 0, 0);
                  $("#saveas").attr("href", canvas.toDataURL("image/png"));
              }, false);
  image.src = currentPattern.dataUri;
}

function Palette(name, colors) {
  this.name = name;
  this.colors = colors;
}

function getColourSchemes(limit) {
  $.ajax({
      type: "GET",
      url: "http://www.colourlovers.com/api/palettes/top?jsonCallback=?",
      data: { numResults: limit },
      dataType: 'json',
      success: function(data){
        $(data).each(function() {
          var palette_hash = this;
          var palette_name = palette_hash["title"];
          var colors = [];

          $(palette_hash["colors"]).each(function(){
            colors.push("#" + this);
          });

          palettes.push(new Palette(palette_name, colors));
        });
        addColourSchemeControls();
        currentXPalette = palettes[0];
        currentYPalette = palettes[0];
        setNewTrianglifier();
        generateBackground();
        $("#loading").fadeOut(500);
      }
  });
}

function addColourSchemeControls() {
  var select = $("<select id='colour-scheme-select-x' name='colour-scheme-x'>");

  $(palettes).each(function(index){
    $(select).append($("<option></option>").attr("value", index).text(this.name));
  });

  $("#generate").before(select);

  $("#colour-scheme-select-x").on("change", function(){
    currentXPalette = palettes[$(this).val()];
    setNewTrianglifier();
    generateBackground();
  });

  select = $("<select id='colour-scheme-select-y' name='colour-scheme'>");

  $(palettes).each(function(index){
    $(select).append($("<option></option>").attr("value", index).text(this.name));
  });

  $("#generate").before(select);

  $("#colour-scheme-select-y").on("change", function(){
    currentYPalette = palettes[$(this).val()];
    setNewTrianglifier();
    generateBackground();
  });
}

function initiateSliders() {
  $('#noise-slider').slider({
    max: 1,
    min: 0,
    value: 0,
    step: 0.1,
    slide: function(e,ui) {
      $('#noise-value').html(ui.value);
      setNewTrianglifier();
      generateBackground();
    }
  });

  $('#cell-slider').slider({
    max: 500,
    min: 10,
    value: 150,
    step: 10,
    slide: function(e,ui) {
      $('#cell-value').html(ui.value);
      setNewTrianglifier();
      generateBackground();
    }
  });
}

$(".screen-size-input").on("change", function(){
  setNewTrianglifier();
  generateBackground();
});

 $("#randomise-colours").on("click", function(){
    // Need to call change() to trigger the event handler so the background is updated
    $("#colour-scheme-select-x").val(Math.floor(Math.random() * NO_OF_PALETTES_TO_RETRIEVE)).change();
    $("#colour-scheme-select-y").val(Math.floor(Math.random() * NO_OF_PALETTES_TO_RETRIEVE)).change();
  });
