Effects.addAdditionalEffects = function(effects) {
  effects.data.push({
    id: 'glasses',
    name: 'Glasses',
    filter: function(canvas, element) {
      
      /* Imageオブジェクトを生成 */
      var img = new Image();
      img.src = "image1.gif";
      /* 画像を描画 */
      ctx.drawImage(img, 0, 0);
    }
  });
};