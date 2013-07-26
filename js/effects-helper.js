/**
 * This is used for loading camera-app's object.
 */
var Effects;
var FaceTracker;

var defineHandlers = [
  function(effects) {
    Effects = effects;
    Effects.defineAdditionalEffects = function(effects) {
      var glassesImage = new Image();
      glassesImage.src = 'glasses.png';
      effects.data.push({
        id: 'glasses',
        name: 'Glasses',
        tracks: true,
        filter: function(canvas, element, frame, track) {
          var context = canvas.getContext('2d');
          for (var i = 0; i < track.faces.length; i++) {
            var face = track.faces[i];
            context.save();
            context.scale(element.width / track.trackWidth,
                          element.width / track.trackWidth);
            context.translate(face.x + face.width / 2,
                              face.y + face.height * 0.15);
            context.scale(face.width * 2, face.width * 2);
            context.scale(track.trackWidth / element.width,
                          track.trackWidth / element.width);
            context.scale(1 / glassesImage.width, 1 / glassesImage.width);
            context.translate(-glassesImage.width / 2, 0);
            context.drawImage(glassesImage, 0, 0);
            context.restore();
          }
        }
      });
    };
  },

  function(faceTracker) {
    FaceTracker = faceTracker;
  }
];

var define = function(_, type) {
  defineHandlers.shift().call(null, type);
};
