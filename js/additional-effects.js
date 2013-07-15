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
        context.translate(face.x + face.width / 2, face.y + face.height * 0.15);
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
