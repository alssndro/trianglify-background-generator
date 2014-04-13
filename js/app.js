var currentTrianglifier;
var currentPattern;

var palettes = [];
var currentPalette;

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
  colors: function(){
    return currentPalette.colors;
  }
};

initiateSliders();
getColourSchemes(10);




function setNewTrianglifier() {
  currentTrianglifier = new Trianglify({"noiseIntensity": triOptions.noise(),
                          "cellsize": triOptions.cellSize(),
                          "x_gradient": triOptions.colors()
                        });
}

$("#generate").on('click', function() {
  setNewTrianglifier();
  generateBackground();
});

function generateBackground() {
  currentPattern = currentTrianglifier.generate(triOptions.width(), triOptions.height());

  $("#backgrounds").css({"background-image": currentPattern.dataUrl});

  //$("#the-image").replaceWith(pattern.svgString);
}

$("#convert").on('click', function() {
  canvg('canvas', currentPattern.svgString);
  var canvas = document.getElementById("canvas");
  var img = canvas.toDataURL("image/png");
  window.open(img);
});

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
        currentPalette = palettes[0];
        setNewTrianglifier();
        generateBackground();
      }
  });
}

function addColourSchemeControls() {
  var select = $("<select id='colour-scheme-select' name='colour-scheme'>");

  $(palettes).each(function(index){
    $(select).append($("<option></option>").attr("value", index).text(this.name));
  });

  $("#generate").before(select);

  $("#colour-scheme-select").on("change", function(){
    currentPalette = palettes[$(this).val()];
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
