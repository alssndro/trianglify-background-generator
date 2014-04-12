  $('#noise-slider').slider({ 
    max: 1,
    min: 0,
    value: 0.5,
    step: 0.01,
    slide: function(e,ui) {
      $('#noise-value').html(ui.value);
      generateBackground();
    }
  });

  $('#cell-slider').slider({ 
    max: 1000,
    min: 0,
    value: 150,
    step: 10,
    slide: function(e,ui) {
      $('#cell-value').html(ui.value);
      generateBackground();
    }
  });

$("#generate").on('click', function() {
  generateBackground();
});

function generateBackground() {
  var noise = $('#noise-slider').slider("value");
  var cellSize = $('#cell-slider').slider("value");

  var t = new Trianglify({"noiseIntensity": noise,
                          "cellsize": cellSize});

  var width = parseInt($("#bg-width").val());
  var height = parseInt($("#bg-height").val());
  var pattern = t.generate(width, height);

  $("#the-image").css({"background-image": pattern.dataUrl,
                      "width": width,
                      "height": height
                      });

  //$("#the-image").replaceWith(pattern.svgString);
}
