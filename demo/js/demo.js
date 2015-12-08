(function(window, document) {
    var createGIFButton = document.querySelector('#create-gif'),
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
        gifshotImagePreview = $('.gifshot-image-preview-section'),
        placeholderDiv = document.querySelector('.placeholder-div'),
        placeholderDivDimensions = document.querySelector('.placeholder-div-dimensions'),
        gifshotCode = document.querySelector('.gifshot-code'),
        gifshotCodeTemplate = document.querySelector('.gifshot-code-template'),
        getSelectedOptions = function() {
            return {
                'gifWidth': +gifWidth.value,
                'gifHeight': +gifHeight.value,
                'images': false,
                'video': false,
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
                        placeholderDiv.classList.add('hidden');
                        progressBar.classList.remove('hidden');
                        progressBar.value = captureProgress;
                    }
                });

                var method = gifType.value === 'snapshot' ? 'takeSnapShot' : 'createGIF';

                gifshot[method](passedOptions, function(obj) {
                    if (!obj.error) {
                        var image = obj.image;

                        progressBar.classList.add('hidden');
                        progressBar.value = 0;
                        var container = $('<div>').addClass("col-md-3");
                        var animatedImage = $('<img>').attr('src', image);
                        container.append(animatedImage);
                        var button = $('<button>').text('Create Link')
						.addClass("btn btn-primary btn-block")
						.click(function() {
                            $.ajax({
                                url: '/saveBase64Image',
                                type: "POST",
                                data: JSON.stringify({
                                    image: image
                                }),
                                contentType: "application/json; charset=utf-8",
                                dataType: "json",
                                success: function(result) {
                                    animatedImage.attr('src', result.imageSrc);
                                    button.text('Copy Link').click(function() {
                                        window.prompt("Copy to clipboard: Ctrl+C, Enter", window.location.href + result.imageSrc);
                                    });
                                }
                            });
                        });
                        container.append(button);
                        gifshotImagePreview.append(container);
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
        navigator.getUserMedia({
            video: true
        }, handleVideo, videoError);
    }

    function handleVideo(stream) {
        video.src = window.URL.createObjectURL(stream);
    }

    function videoError(e) {
        // do something
    }




    bindEvents();
}(window, document));