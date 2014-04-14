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
  cellpadding: function(){
    return $('#cellpadding-slider').slider("value");
  },
  bleed: function(){
    return $('#bleed-slider').slider("value");
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
  currentTrianglifier = new Trianglify({"bleed": triOptions.bleed(),
                          "cellsize": triOptions.cellSize(),
                          "x_gradient": triOptions.xColors(),
                          "y_gradient": triOptions.yColors(),
                          "cellpadding": triOptions.cellpadding(),
                          "noiseIntensity": 0
                        });
}

function updateScreen() {
  setNewTrianglifier();
  generateBackground();
}

$("#generate").on('click', function() {
  updateScreen();
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
        addColourList();
        currentXPalette = palettes[0];
        currentYPalette = palettes[0];
        updateScreen();
        $("#loading").fadeOut(500);
      }
  });
}

function initiateSliders() {
  $('#bleed-slider').slider({
    max: 500,
    min: 10,
    value: 150,
    step: 5,
    slide: function(e, slider) {
      $('#bleed-value').html(slider.value);
      updateScreen();
    }
  });

  $('#cell-slider').slider({
    max: 500,
    min: 10,
    value: 150,
    step: 5,
    slide: function(e, slider) {
      $('#cell-value').html(slider.value);
      updateScreen();
    }
  });

  $('#cellpadding-slider').slider({
    max: 500,
    min: 10,
    value: 15,
    step: 5,
    slide: function(e, slider) {
      $('#cellpadding-value').html(slider.value);
      updateScreen();
    }
  });
}

$(".screen-size-input").on("change", function(){
  updateScreen();
});

$("#randomise-colours").on("click", function(){
  currentXPalette = palettes[(Math.floor(Math.random() * NO_OF_PALETTES_TO_RETRIEVE))];
  currentYPalette = palettes[(Math.floor(Math.random() * NO_OF_PALETTES_TO_RETRIEVE))];
  updateScreen();
});

$("#match-colours").on("click", function(){
  currentYPalette = currentXPalette;
  updateScreen();
});

function addColourList() {
  $(palettes).each(function(index){
    var cont = $("<div class='palette-cont clearfix' data-palette-index='" + index + "'></div>");
    var palette = this;
    var noOfColors = palette.colors.length;

    $(palette.colors).each(function(){
      var paletteColor = $("<span class='palette-colour'></span>");
      $(paletteColor).css({"width": (100 / noOfColors) + "%",
                            "background-color": this});
      $(cont).append(paletteColor);
    });
    $("#colour-list").append(cont);
  });

  $("#colour-list").on("click", ".palette-cont", function() {
    var paletteIndex = $(this).data("palette-index");
    if ($("[type='radio']:checked").val() === "x") {
      currentXPalette = palettes[paletteIndex];
    } else {
      currentYPalette = palettes[paletteIndex];
    }
    updateScreen();
  });
}
