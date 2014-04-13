$('#noise-slider').slider({ 
  max: 1,
  min: 0,
  value: 0,
  step: 0.01,
  slide: function(e,ui) {
    $('#noise-value').html(ui.value);

    if ($("#auto-generate").prop("checked")) {
      generateBackground();
    }
  }
});

$('#cell-slider').slider({ 
  max: 500,
  min: 10,
  value: 150,
  step: 10,
  slide: function(e,ui) {
    $('#cell-value').html(ui.value);
    
    if ($("#auto-generate").prop("checked")) {
      generateBackground();
    }
  }
});

var currentTrianglifier;

// Generate a pattern for when the page loads
generateBackground();

$("#generate").on('click', function() {
  generateBackground();
});

function generateBackground() {
  var noise = $('#noise-slider').slider("value");
  var cellSize = $('#cell-slider').slider("value");

  var t = new Trianglify({"noiseIntensity": noise,
                          "cellsize": cellSize,
                          "x_gradient": ['#00A0B0','#6A4A3C','#CC333F','#EB6841','#EDC951']
                        });

  var width = parseInt($("#bg-width").val());
  var height = parseInt($("#bg-height").val());
  var pattern = t.generate(width, height);

  $("#backgrounds").css({"background-image": pattern.dataUrl});
  currentTrianglifier = t;

  //$("#the-image").replaceWith(pattern.svgString);
}

$("#convert").on('click', function() {
  var cellSize = $('#cell-slider').slider("value");

  var t = new Trianglify({"noiseIntensity": 0,
                          "cellsize": cellSize});

  var width = parseInt($("#bg-width").val());
  var height = parseInt($("#bg-height").val());
  var pattern = t.generate(width, height);
  canvg('canvas', pattern.svgString);
  var canvas = document.getElementById("canvas");
  var img = canvas.toDataURL("image/png");
  $("#downloadable-image").replaceWith($("<img id='downloadable-image'></img>").prop('src', img));
  window.open(img);
});

// $.ajax({ 
//     type: "GET",
//     url: "http://www.colourlovers.com/api/palettes/top?jsonCallback=?", 
//     data: { numResults: 10 },
//     dataType: 'json',
//     success: function(data){        
//         $(data).each(function() {
//           $("#output").append("<p>" + this["title"] + "</p>");
//             $("#output").append("[");
//             $(this["colors"]).each(function(){
//                 $("#output").append("'#" + this + "',");
//             });
//               $("#output").append("]");
//         });
//     }
// });
