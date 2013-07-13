Effects.defineAdditionalEffects = function(effects) {
  var glassesImage = new Image();
  glassesImage.src = 'glasses.png';
  effects.data.push({
    id: 'glasses',
    name: 'Glasses',
    tracks: true,
    filter: function(canvas, element, frame, track) {
      if (track.faces.length == 0)
        return;
      var context = canvas.getContext('2d');
      context.save();
      var face = track.faces[0];
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
  });
};
