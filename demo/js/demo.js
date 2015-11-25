(function(window, document) {
  var createGIFButton = document.querySelector('#create-gif'),
    gifSource = document.querySelector('#GIFSource'),
    gifType = document.querySelector('#GIFType'),
    interval = document.querySelector("#interval"),
    numFrames = document.querySelector("#numFrames"),
    gifHeight = document.querySelector("#gifHeight"),
    gifWidth = document.querySelector("#gifWidth"),
    progressBar = document.querySelector("progress"),
    text = document.querySelector('#gifText'),
    fontWeight = document.querySelector('#fontWeight'),
    fontSize = document.querySelector('#fontSize'),
    fontFamily = document.querySelector('#fontFamily'),
    fontColor = document.querySelector('#fontColor'),
    textAlign = document.querySelector('#textAlign'),
    textBaseline = document.querySelector('#textBaseline'),
    sampleInterval = document.querySelector('#sampleInterval'),
    numWorkers = document.querySelector('#numWorkers'),
    saveAsFile = document.querySelector('#saveAsFile'),
    gifshotImagePreview = document.querySelector('.gifshot-image-preview-section'),
    placeholderDiv = document.querySelector('.placeholder-div'),
    placeholderDivDimensions = document.querySelector('.placeholder-div-dimensions'),
    gifshotCode = document.querySelector('.gifshot-code'),
    gifshotCodeTemplate = document.querySelector('.gifshot-code-template'),
    getSelectedOptions = function() {
      return {
        'gifWidth': +gifWidth.value,
        'gifHeight': +gifHeight.value,
        'images': gifSource.value === 'images' ? ['http://i.imgur.com/2OO33vX.jpg', 'http://i.imgur.com/qOwVaSN.png', 'http://i.imgur.com/Vo5mFZJ.gif'] : false,
        'video': gifSource.value === 'video' ? ['example.mp4', 'example.ogv'] : false,
        'interval': +interval.value,
        'numFrames': +numFrames.value,
        'text': text.value,
        'fontWeight': fontWeight.value,
        'fontSize': fontSize.value + 'px',
        'fontFamily': fontFamily.value,
        'fontColor': fontColor.value,
        'textAlign': textAlign.value,
        'textBaseline': textBaseline.value,
        'sampleInterval': +sampleInterval.value,
        'numWorkers': +numWorkers.value,
      }
    },
    passedOptions,
    bindEvents = function() {
      createGIFButton.addEventListener('click', function(e) {
        passedOptions = _.merge(_.clone(getSelectedOptions()), {
          'progressCallback': function(captureProgress) {
            //gifshotImagePreview.innerHTML = '';
            placeholderDiv.classList.add('hidden');
            progressBar.classList.remove('hidden');
            progressBar.value = captureProgress;
          }
        });

        var method = gifType.value === 'snapshot' ? 'takeSnapShot' : 'createGIF';

        gifshot[method](passedOptions, function(obj) {
          if (!obj.error) {
            var image = obj.image;

            var setImageCallBack = function(imageSrc){
              progressBar.classList.add('hidden');
              progressBar.value = 0;
              animatedImage = document.createElement('img');
              animatedImage.src = imageSrc;
              gifshotImagePreview.appendChild(animatedImage);
            };
            
            if(saveAsFile.checked){
              ajax({
                url:'/upload',
                type:"POST",
                data:JSON.stringify({image:image}),
                contentType:"application/json; charset=utf-8",
                dataType:"json",
                success: function(result){
                  setImageCallBack(result.imageSrc);
                }
              });
              
            }else{
              setImageCallBack(image);
            }
          } else {
            console.log('obj.error', obj.error);
            console.log('obj.errorCode', obj.errorCode);
            console.log('obj.errorMsg', obj.errorMsg);
          }
        });
      }, false);

    };

	var video = document.querySelector("#videoElement");
	 
	navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia;
	 
	if (navigator.getUserMedia) {       
		navigator.getUserMedia({video: true}, handleVideo, videoError);
	}
	 
	function handleVideo(stream) {
		video.src = window.URL.createObjectURL(stream);
	}
	 
	function videoError(e) {
		// do something
	}


		
	
  bindEvents();
}(window, document));