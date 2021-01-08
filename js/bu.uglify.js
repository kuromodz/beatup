BUJS.Music_ = function (onComponentFinishLoading_) {
    var _this = this;
    _this.sounds_ = {
        perfect_: "perfect.wav",
        normal_ : "normal.wav",
        miss_   : "miss.wav",
        space_  : "space.wav" };
    _this.context_ = new (window.AudioContext || window.webkitAudioContext)();
    _this.onComponentFinishLoading_ = onComponentFinishLoading_;

    async.eachOf(_this.sounds_, function (sound, index, callback) {
        var request = new XMLHttpRequest();
        request.open('GET', "sound/" + sound, true);
        request.responseType = 'arraybuffer';
        request.onload = function () {
            _this.context_.decodeAudioData(request.response, function (buffer) {
                console.log("Loaded sound", sound);
                _this.sounds_[index] = buffer;
            }, function (error) {
                console.error("Error decoding audio data", error);
            });
            callback();
        };
        request.send();
    });

    _this.parse_("notes/" + bujs.game_.songId_ + ".json");
};

/**
 * Parse song info json
 */
BUJS.Music_.prototype.parse_ = function (url) {
    var _this = this;
    $.get(url, function (resp) {
        _this.songInfo_ = bujs.songList_[bujs.game_.songId_];
        _this.songInfo_.notes_ = resp;
        _this.tickTime_ = 1000 * 60.0 / (_this.songInfo_.bpm * 4);
        _this.convertTickToMs_();
        _this.loadBackgroundMusic_("music/" + _this.songInfo_.ogg);
    });
};

/**
 * Load music from server, pass to audio context
 */
BUJS.Music_.prototype.loadBackgroundMusic_ = function (url) {
    var _this = this;
    var request = new XMLHttpRequest();
    bujs.showLoadingMsg_("Downloading music");
    request.open('GET', url, true);
    request.responseType = 'arraybuffer';
    request.onload = function () {
        // TODO: BUM thingies...
        if (bujs.iOS_) {
            _this.response_ = new ArrayBuffer(request.response.byteLength);
            new Uint8Array(_this.response_).set(new Uint8Array(request.response));
            bujs.showLoadingMsg_("Touch/click to start music");
        }
        else {
            _this.context_.decodeAudioData(request.response, function (buffer) {
                    _this.musicSource_ = _this.loadSound_(buffer);
                    _this.musicStartTime_ = _this.context_.currentTime;
                    _this.musicSource_.start(0);
                    if (typeof _this.onComponentFinishLoading_ !== 'undefined') {
                        _this.onComponentFinishLoading_.call(bujs.game_, _this);
                    }
                },
                function (error) {
                    console.error("Error decoding audio data", error);
                });
        }
    };
    request.send();
};

/**
 * Wrapper to load a specific sound and attach it to the audio context
 */
BUJS.Music_.prototype.loadSound_ = function (buffer) {
    var source = this.context_.createBufferSource();
    source.buffer = buffer;
    source.connect(this.context_.destination);
    return source;
};

/**
 * Load a sound then play it
 */
BUJS.Music_.prototype.playSound_ = function (buffer) {
    this.loadSound_(buffer).start(0);
};

BUJS.Music_.prototype.convertTickToMs_ = function () {
    var _this = this;
    for (var i = 0; i < _this.songInfo_.notes_.length; i++) {
        _this.songInfo_.notes_[i].t = _this.songInfo_.notes_[i].t * _this.tickTime_;
    }
};

BUJS.Music_.prototype.getCurrTime_ = function () {
    return (this.context_.currentTime - this.musicStartTime_) * 1000;
};;// interesting read: https://webglfundamentals.org/webgl/lessons/webgl-2d-drawimage.html


// alrite, let's go WebGL later for some more challenge :)
// 2d canvas for playability at the moment

/**
 * Constructor for this renderer
 */
BUJS.Renderer_ = function (onComponentFinishLoading_) {
    var _this = this;
    _this.images_ = [];
    _this.onComponentFinishLoading_ = onComponentFinishLoading_;
    _this.setupConfig_();
    _this.setupSpriteInfo_();
    _this.setupSpriteConsts_();
};

/**
 * Load sprite images for each type in parallel
 */
BUJS.Renderer_.prototype.asyncLoadSprites_ = function () {
    var _this = this;
    async.eachOf(_this.sprites_, _this.loadSpritesForType_,
        function (err) {
            if (err) {
                console.error("Meh. Error", err);
            }
            else {
                console.log("Finished loading sprites.");
                _this.initSpritePos_();
                // resize canvas
                var canvas = document.getElementById("cvs");
                _this.ctx_ = canvas.getContext("2d");
                var width = _this.config_.canvasWidth_ * _this.config_.scaleRatio_;
                var height = _this.config_.canvasHeight_ * _this.config_.scaleRatio_;
                canvas.width = width;
                canvas.height = height;

                if (typeof _this.onComponentFinishLoading_ !== "undefined") {
                    _this.onComponentFinishLoading_.call(bujs.game_, _this);
                }
            }
        });
};

/**
 * Initialize config variables
 */
BUJS.Renderer_.prototype.setupConfig_ = function () {
    this.config_ = {
        imagePath_          : "img/",
        scaleRatio_         : 1,
        canvasWidth_        : 980,
        canvasHeight_       : 400
    };
};

/**
 * Initialize sprite names
 */
BUJS.Renderer_.prototype.setupSpriteInfo_ = function () {
    var _this = this;
    _this.sprites_ = {
        background_: ["bg/lafesta.jpg"],
        dnxpLogo_  : ["dnxp.png"],
        laneDown_  : ["lane_7.png", "lane_4.png", "lane_1.png",
                     "lane_9.png", "lane_6.png", "lane_3.png"],
        beatDown_  : ["beatdown_7.png", "beatdown_4.png", "beatdown_1.png",
                      "beatdown_9.png", "beatdown_6.png", "beatdown_3.png"],
        tableL_    : ["tableL.png"],
        laneL_     : ["laneL.png"],
        landingL_  : ["landingL.png"],
        tableR_    : ["tableR.png"],
        laneR_     : ["laneR.png"],
        landingR_  : ["landingR.png"],
        spaceFrame_: ["space_frame.png"],
        spaceFrameCursor_  : ["space_frame_cursor.png"],
        spaceFrameExplode_ : ["space_frame_explode.png"],
        spaceExplode_      : ["space_frame_space_explode.png"],
        arrowExplode_      : ["arrow_explode.png"],
        a7_        : ["a71.png", "a72.png", "a73.png", "a74.png", "a75.png", "a76.png", "a77.png", "a78.png"],
        a4_        : ["a41.png", "a42.png", "a43.png", "a44.png", "a45.png", "a46.png", "a47.png", "a48.png"],
        a1_        : ["a11.png", "a12.png", "a13.png", "a14.png", "a15.png", "a16.png", "a17.png", "a18.png"],
        a9_        : ["a91.png", "a92.png", "a93.png", "a94.png", "a95.png", "a96.png", "a97.png", "a98.png"],
        a6_        : ["a61.png", "a62.png", "a63.png", "a64.png", "a65.png", "a66.png", "a67.png", "a68.png"],
        a3_        : ["a31.png", "a32.png", "a33.png", "a34.png", "a35.png", "a36.png", "a37.png", "a38.png"],
        spaceFrameLetters_             : ["space_frame_letter_b.png", "space_frame_letter_e.png", "space_frame_letter_a.png",
                                        "space_frame_letter_t.png", "space_frame_letter_u.png", "space_frame_letter_p.png"],
        spaceFrameLetterGlowBlue_      : ["space_frame_letter_glow_blue.png"],
        spaceFrameLetterGlowYellow_    : ["space_frame_letter_glow_yellow.png"],
        spaceFrameGlowBlue_            : ["space_frame_glow_blue.png"],
        spaceFrameGlowYellow_          : ["space_frame_glow_yellow.png"],
        blueUp_        : ["up_1.png"],
        yellowUp_      : ["up.png"],
        noteResults_   : ["perfect.png", "great.png", "cool.png", "bad.png", "miss.png"],
        delIcons_      : ["del_1.png", "del_2.png"],
        chanceIcons_      : ["chance_1.png", "chance_2.png", "chance_3.png", "chance_4.png"],
        c7_        : ["c71.png"],
        c4_        : ["c41.png"],
        c1_        : ["c11.png"],
        c9_        : ["c91.png"],
        c6_        : ["c61.png"],
        c3_        : ["c31.png"]
    };

    for (var key in _this.sprites_) _this.sprites_[key]._this = _this;   // add _this...
};

/**
 * Some special constants for drawing
 */
BUJS.Renderer_.prototype.setupSpriteConsts_ = function () {
    var _this = this;
    _this.consts_ = {
        chanceDist_         : 80,
        baseResultLine_     : 150,
        arrowAnimationTime_ : 135,
        laneYStart_         : _this.config_.canvasHeight_ - 350,
        lane1Yofs_          : 3,
        lane2Yofs_          : 3+64,        // Renderer_.spritePos_.lane1Yofs + 64,
        lane3Yofs_          : 3+64+64,     // Renderer_.spritePos_.lane2Yofs + 64,
        lane2Xofs_          : 5,
        laneWidth_          : 256,
        tableWidth_         : 123,
        tableWidthTrans_    : 3,
        arrowLaneOfs_       : 1,
        spaceMarginBottom_  : 80,
        beatupLetterDist_   : 46,
        dnxpLogoMargin_     : 20,
        textHeight_         : 20,
        textMarginTop_      : 64,
        numNotes_           : 14,
        playerListUp_       : 40,
        playerListName_     : 200,
        playerListScore_    : 60,
        playerListYofs_     : 80,
        scoreTableXofs_     : (_this.config_.canvasWidth_ - 600) / 2,
        fontSize_           : 11,
        helpYofs_           : 150
    }
};


/**
 * Load a set of images for a type, e.g.
 * { noteResults   : ["perfect.png", "great.png", "cool.png", "bad.png", "miss.png"] },
 */
BUJS.Renderer_.prototype.loadSpritesForType_ = function (spriteInfo, key, callback) {
    var _this = spriteInfo._this;
    async.each(spriteInfo, function (fileName, urlCallback) {
            if (typeof fileName !== "string") return;
            // console.log("sprite", key, "fetching ", fileName);
            var img = new Image();
            img.onload = function () {
                if (typeof _this.sprites_[key] === "undefined") {
                    _this.sprites_[key] = [];
                }
                _this.sprites_[key][spriteInfo.indexOf(fileName)] = img;
                urlCallback();
            };
            img.src = _this.config_.imagePath_ + fileName;
        },
        function (err) {
            // loaded all images for one spriteInfo ok.
            if (err) {
                console.error("Meh. Error", err);
            }
            else {
                console.log("Finished fetching images for object", key);
                callback();
            }
        });
};

/**
 * Clear the whole canvas
 */
BUJS.Renderer_.prototype.clear_ = function () {
    var _this = this;
    _this.ctx_.fillStyle = "black";
    _this.ctx_.clearRect(0, 0, _this.config_.canvasWidth_, _this.config_.canvasHeight_);
};

/**
 * A wrapper to write some text on canvas
 */
BUJS.Renderer_.prototype.writeText_ = function (pos, text, font, size, color) {
    var _this = this;
    if (!size) size = "12px";
    if (!font) font = "Arial";
    if (!color) color = "white";
    _this.ctx_.font = size + " " + font;
    _this.ctx_.fillStyle = color;
    _this.ctx_.textAlign = "left";
    _this.ctx_.fillText(text, pos.x, pos.y);
};

/**
 * Draw a specific sprite
 */
BUJS.Renderer_.prototype.drawSprite_ = function (sprite, scale) {
    var _this = this;
    if (typeof sprite === "undefined" || sprite === null) {
        console.log("meh.");
    }
    if (typeof sprite !== "undefined" && sprite !== null && typeof sprite.pos !== "undefined") {
        if (typeof scale === "undefined") scale = 1;
        _this.ctx_.drawImage(sprite, sprite.pos.x, sprite.pos.y, sprite.width * scale, sprite.height * scale);
    }
};

/**
 * Draw fix contents, such as lanes, landings, logo...
 */
BUJS.Renderer_.prototype.drawFixContent_ = function (combo) {
    var _this = this;

    // lane, landing, logo
    _this.drawSprite_(_this.sprites_.laneL_[0]);
    _this.drawSprite_(_this.sprites_.laneR_[0]);
    _this.drawSprite_(_this.sprites_.landingL_[0]);
    _this.drawSprite_(_this.sprites_.landingR_[0]);
    _this.drawSprite_(_this.sprites_.dnxpLogo_[0]);
    _this.drawSpaceFrame_(combo);
    _this.drawResults_();
};

BUJS.Renderer_.prototype.drawTouchArrows_ = function () {
    var _this = this;
    _this.drawSprite_(_this.sprites_.c7_[0]);
    _this.drawSprite_(_this.sprites_.c9_[0]);
    _this.drawSprite_(_this.sprites_.c4_[0]);
    _this.drawSprite_(_this.sprites_.c6_[0]);
    _this.drawSprite_(_this.sprites_.c1_[0]);
    _this.drawSprite_(_this.sprites_.c3_[0]);
};

BUJS.Renderer_.prototype.drawResults_ = function () {
    var _this = this;
    var x = (_this.config_.canvasWidth_ - 135) / 2;
    var y = (_this.consts_.laneYStart_ + _this.consts_.textMarginTop_);
    _this.writeText_({x: x, y: y},
        'X/P/G/C/B/M: ' + bujs.game_.perx_ + '/' + bujs.game_.pgcbm_[0] + '/'
        + bujs.game_.pgcbm_[1] + '/' + bujs.game_.pgcbm_[2] + '/'
        + bujs.game_.pgcbm_[3] + '/' + bujs.game_.pgcbm_[4]);
    _this.writeText_({x: x, y: y + 16}, 'Score:' + Math.round(bujs.game_.score_));
    _this.writeText_({x: x, y: y + 32}, 'Combo:' + bujs.game_.combo_);
    var pgcbm = bujs.game_.pgcbm_,
        perpercent = 0;
    if (pgcbm[0] !== 0 || pgcbm[1] !== 0 ||
        pgcbm[2] !== 0 || pgcbm[3] !== 0 ||
        pgcbm[4] !== 0) {
        perpercent = (pgcbm[0] * 100) / (pgcbm[0] + pgcbm[1] + pgcbm[2] + pgcbm[3] + pgcbm[4]);
    }
    _this.writeText_({x: x, y: y + 48}, 'Perfect %:' + perpercent.toFixed(2) + '%');
    _this.writeText_({x: x, y: y + 64}, 'Max X:' + bujs.game_.xmax_);
};

/**
 * Draw space frame
 */
BUJS.Renderer_.prototype.drawSpaceFrame_ = function (combo) {
    var _this = this;
    if (combo) {
        if (combo >= 100 && combo < 400) {
            _this.drawSprite_(_this.sprites_.spaceFrameGlowYellow_[0]);
        }
        else if (combo >= 400) {
            _this.drawSprite_(_this.sprites_.spaceFrameGlowBlue_[0]);
        }
    }
    _this.drawSprite_(_this.sprites_.spaceFrame_[0]);
};

/**
 * Beat Up text at the bottom
 */
BUJS.Renderer_.prototype.drawBeatupText_ = function (combo) {
    var _this = this;
    // B-E-A-T-U-P glows
    var letterGlow1 = null;
    var letterGlow2 = null;
    var numGlow1 = 0;
    var numGlow2 = 0;

    // decide what to draw
    if (combo >= 400) {
        // all blue
        letterGlow1 = _this.sprites_.spaceFrameLetterGlowBlue_;
        numGlow1 = 6;
    }
    else if (combo >= 100) {
        // some blue + some yellow
        letterGlow1 = _this.sprites_.spaceFrameLetterGlowBlue_;
        letterGlow2 = _this.sprites_.spaceFrameLetterGlowYellow_;
        numGlow1 = Math.floor((combo - 100) / 50);
        numGlow2 = 6 - numGlow1;
    }
    else {
        // some yellow
        letterGlow1 = _this.sprites_.spaceFrameLetterGlowYellow_;
        if (combo >= 80) numGlow1 = 5;
        else if (combo >= 60) numGlow1 = 4;
        else if (combo >= 40) numGlow1 = 3;
        else if (combo >= 20) numGlow1 = 2;
        else if (combo >= 10) numGlow1 = 1;
    }

    // and draw them
    if (letterGlow1 != null) {
        for (var i = 0; i < numGlow1; i++) {
            // the glow
            _this.setSpritePos_(letterGlow1[0],
                _this.config_.canvasWidth_ / 2 - _this.consts_.beatupLetterDist_ / 2 * (5 - i * 2) - _this.sprites_.spaceFrameLetterGlowBlue_[0].width / 2,
                _this.config_.canvasHeight_ - _this.consts_.spaceMarginBottom_ - _this.sprites_.spaceFrameLetterGlowBlue_[0].height / 2);
            _this.drawSprite_(letterGlow1[0]);

            // and its letter
            _this.drawSprite_(_this.sprites_.spaceFrameLetters_[i]);
        }
    }
    if (letterGlow2 != null) {
        for (var i = numGlow1; i < numGlow1 + numGlow2; i++) {
            // the glow
            _this.setSpritePos_(letterGlow2[0],
                _this.config_.canvasWidth_ / 2 - _this.consts_.beatupLetterDist_ / 2 * (5 - i * 2) - _this.sprites_.spaceFrameLetterGlowBlue_[0].width / 2,
                _this.config_.canvasHeight_ - _this.consts_.spaceMarginBottom_ - _this.sprites_.spaceFrameLetterGlowBlue_[0].height / 2);
            _this.drawSprite_(letterGlow2[0]);

            // and its letter
            _this.drawSprite_(_this.sprites_.spaceFrameLetters_[i]);
        }
    }
};

/**
 * Draw table parts. Should be called last to overdraw the arrows
 */
BUJS.Renderer_.prototype.drawTable_ = function () {
    var _this = this;
    _this.drawSprite_(_this.sprites_.tableL_[0]);
    _this.drawSprite_(_this.sprites_.tableR_[0]);
};

/**
 * Set sprite position
 */
BUJS.Renderer_.prototype.setSpritePos_ = function (img, posX, posY) {
    img.pos = {x: posX, y: posY};
};

/**
 * Define sprite position. These are fixed.
 */
BUJS.Renderer_.prototype.initSpritePos_ = function () {
    var _this = this;
    _this.setSpritePos_(_this.sprites_.dnxpLogo_[0],
        _this.config_.canvasWidth_ - _this.sprites_.dnxpLogo_[0].width - _this.consts_.dnxpLogoMargin_,
        _this.config_.canvasHeight_ - _this.sprites_.dnxpLogo_[0].height - _this.consts_.dnxpLogoMargin_);

    _this.setSpritePos_(_this.sprites_.tableL_[0],
        0,
        _this.consts_.laneYStart_);

    _this.setSpritePos_(_this.sprites_.laneL_[0],
        _this.consts_.tableWidth_ - _this.consts_.tableWidthTrans_ - _this.consts_.chanceDist_,
        _this.consts_.laneYStart_);

    _this.setSpritePos_(_this.sprites_.landingL_[0],
        _this.sprites_.laneL_[0].pos.x + _this.consts_.laneWidth_,
        _this.consts_.laneYStart_);


    _this.setSpritePos_(_this.sprites_.tableR_[0],
        _this.config_.canvasWidth_ - _this.consts_.tableWidth_,
        _this.consts_.laneYStart_);

    _this.setSpritePos_(_this.sprites_.laneR_[0],
        _this.config_.canvasWidth_ - _this.consts_.tableWidth_ + _this.consts_.tableWidthTrans_ - _this.consts_.laneWidth_ + _this.consts_.chanceDist_,
        _this.consts_.laneYStart_);

    _this.setSpritePos_(_this.sprites_.landingR_[0],
        _this.config_.canvasWidth_ - _this.consts_.tableWidth_ + _this.consts_.tableWidthTrans_ - _this.consts_.laneWidth_ - _this.sprites_.landingR_[0].width + _this.consts_.chanceDist_,
        _this.consts_.laneYStart_);

    _this.setSpritePos_(_this.sprites_.spaceFrame_[0],
        (_this.config_.canvasWidth_ - _this.sprites_.spaceFrame_[0].width) / 2,
        _this.config_.canvasHeight_ - _this.consts_.spaceMarginBottom_ - _this.sprites_.spaceFrame_[0].height / 2);

    // del icons
    _this.setSpritePos_(_this.sprites_.delIcons_[0], 
        _this.config_.canvasWidth_/2 + _this.sprites_.spaceFrame_[0].width/2, 
        _this.config_.canvasHeight_ - _this.consts_.spaceMarginBottom_ - _this.sprites_.delIcons_[0].height / 2);

    _this.setSpritePos_(_this.sprites_.delIcons_[1],
        _this.config_.canvasWidth_/2 + _this.sprites_.spaceFrame_[0].width/2,
        _this.config_.canvasHeight_ - _this.consts_.spaceMarginBottom_ - _this.sprites_.delIcons_[1].height / 2);

    // chance icons
    _this.setSpritePos_(_this.sprites_.chanceIcons_[0],
        _this.config_.canvasWidth_/2 - _this.sprites_.spaceFrame_[0].width/2 - _this.sprites_.chanceIcons_[0].width,
        _this.config_.canvasHeight_ - _this.consts_.spaceMarginBottom_ - _this.sprites_.chanceIcons_[0].height / 2);

    _this.setSpritePos_(_this.sprites_.chanceIcons_[1],
        _this.config_.canvasWidth_/2 - _this.sprites_.spaceFrame_[0].width/2 - _this.sprites_.chanceIcons_[1].width,
        _this.config_.canvasHeight_ - _this.consts_.spaceMarginBottom_ - _this.sprites_.chanceIcons_[1].height / 2);

    _this.setSpritePos_(_this.sprites_.chanceIcons_[2],
        _this.config_.canvasWidth_/2 - _this.sprites_.spaceFrame_[0].width/2 - _this.sprites_.chanceIcons_[2].width,
        _this.config_.canvasHeight_ - _this.consts_.spaceMarginBottom_ - _this.sprites_.chanceIcons_[2].height / 2);

    _this.setSpritePos_(_this.sprites_.chanceIcons_[3],
        _this.config_.canvasWidth_/2 - _this.sprites_.spaceFrame_[0].width/2 - _this.sprites_.chanceIcons_[3].width,
        _this.config_.canvasHeight_ - _this.consts_.spaceMarginBottom_ - _this.sprites_.chanceIcons_[3].height / 2);

    // space glows
    _this.setSpritePos_(_this.sprites_.spaceFrameGlowBlue_[0],
        (_this.config_.canvasWidth_ - _this.sprites_.spaceFrame_[0].width) / 2,
        _this.config_.canvasHeight_ - _this.consts_.spaceMarginBottom_ - _this.sprites_.spaceFrame_[0].height / 2);

    _this.setSpritePos_(_this.sprites_.spaceFrameGlowYellow_[0],
        (_this.config_.canvasWidth_ - _this.sprites_.spaceFrame_[0].width) / 2,
        _this.config_.canvasHeight_ - _this.consts_.spaceMarginBottom_ - _this.sprites_.spaceFrame_[0].height / 2);

    // B-E-A-T-U-P letters
    for (var i = 0; i < 6; i++) {
        _this.setSpritePos_(_this.sprites_.spaceFrameLetters_[i],
            _this.config_.canvasWidth_ / 2 - _this.consts_.beatupLetterDist_ / 2 * (5 - i * 2) - _this.sprites_.spaceFrameLetters_[0].width / 2,
            _this.config_.canvasHeight_ - _this.consts_.spaceMarginBottom_ - _this.sprites_.spaceFrameLetters_[0].height / 2);
    }
    var leftX = 0,
        rightX = _this.config_.canvasWidth_ - _this.sprites_.a7_[0].width;
    _this.setSpritePos_(_this.sprites_.c7_[0], leftX, _this.consts_.laneYStart_ + _this.consts_.lane1Yofs_);
    _this.setSpritePos_(_this.sprites_.c9_[0], rightX, _this.consts_.laneYStart_ + _this.consts_.lane1Yofs_);
    _this.setSpritePos_(_this.sprites_.c4_[0], leftX, _this.consts_.laneYStart_ + _this.consts_.lane2Yofs_);
    _this.setSpritePos_(_this.sprites_.c6_[0], rightX, _this.consts_.laneYStart_ + _this.consts_.lane2Yofs_);
    _this.setSpritePos_(_this.sprites_.c1_[0], leftX, _this.consts_.laneYStart_ + _this.consts_.lane3Yofs_);
    _this.setSpritePos_(_this.sprites_.c3_[0], rightX, _this.consts_.laneYStart_ + _this.consts_.lane3Yofs_);
};


/**
 * Draw a single arrow on the lane/landing
 */
BUJS.Renderer_.prototype.drawArrow_ = function (arrowSprite, xOfs, yOfs, leftLane, noteTime) {
    var _this = this;
    var delta = 0;
    var x = 0;
    var y = _this.consts_.laneYStart_ + yOfs;
    var currTime = bujs.game_.music_.getCurrTime_();
    if (leftLane) {
        x = (xOfs + _this.consts_.tableWidth_ - _this.consts_.tableWidthTrans_ +
            _this.consts_.laneWidth_ - _this.consts_.chanceDist_ +
            _this.consts_.arrowLaneOfs_) -
            (noteTime - currTime - delta) * 40.0 / bujs.game_.music_.tickTime_;
    }
    else {
        x = _this.config_.canvasWidth_ -
            (xOfs + _this.consts_.tableWidth_ - _this.consts_.tableWidthTrans_ +
                _this.consts_.laneWidth_ - _this.consts_.chanceDist_ +
                _this.consts_.arrowLaneOfs_ + arrowSprite.width) +
            (noteTime - currTime - delta) * 40.0 / bujs.game_.music_.tickTime_;
    }

    // skip out of visible areas
    if (x > _this.config_.canvasWidth_ - _this.consts_.tableWidth_ || x + arrowSprite.width < _this.consts_.tableWidth_) {
        return;
    }

    _this.setSpritePos_(arrowSprite, x, y);
    _this.drawSprite_(arrowSprite);
};

/**
 * Draw arrows for perfect alignment
 */
BUJS.Renderer_.prototype.drawPerfectArrows_ = function () {
    var _this = this;
    var xOfs = 1;
    _this.drawArrow_(_this.sprites_.a7_[0], xOfs, _this.consts_.lane1Yofs_, true, bujs.game_.music_.getCurrTime_());
    _this.drawArrow_(_this.sprites_.a9_[0], xOfs, _this.consts_.lane1Yofs_, false, bujs.game_.music_.getCurrTime_());
    _this.drawArrow_(_this.sprites_.a4_[0], xOfs + _this.consts_.lane2Xofs_, _this.consts_.lane2Yofs_, true, bujs.game_.music_.getCurrTime_());
    _this.drawArrow_(_this.sprites_.a6_[0], xOfs + _this.consts_.lane2Xofs_, _this.consts_.lane2Yofs_, false, bujs.game_.music_.getCurrTime_());
    _this.drawArrow_(_this.sprites_.a1_[0], xOfs, _this.consts_.lane3Yofs_, true, bujs.game_.music_.getCurrTime_());
    _this.drawArrow_(_this.sprites_.a3_[0], xOfs, _this.consts_.lane3Yofs_, false, bujs.game_.music_.getCurrTime_());

};

/**
 * Draw arrows for current notes;
 */
BUJS.Renderer_.prototype.drawNotes_ = function (currTime) {
    var _this = this;
    var lastAvailNote = Math.min(bujs.game_.firstAvailNote_ + _this.consts_.numNotes_, bujs.game_.music_.songInfo_.notes_.length);
    if (bujs.game_.firstAvailNote_ >= 0) {
        var tickTime = bujs.game_.music_.tickTime_;
        for (var i = bujs.game_.firstAvailNote_; i < lastAvailNote; i++) {
            var note = bujs.game_.music_.songInfo_.notes_[i];
            var noteTime = note.t;
            var noteKey = note.n;

            // max note time for drawing
            var maxArrowAvailTime = currTime + tickTime * (_this.consts_.numNotes_ + 1);
            var maxSpaceAvailTime = currTime + tickTime * 8;
            if ((noteKey !== 5 && noteTime > maxArrowAvailTime) ||
                (noteKey === 5 && noteTime > maxSpaceAvailTime)) break;


            // only draw unpressed notes
            if (!note.pressed_) {
                var imageIndex = 0;
                var leftLane = true;
                var xOfs = 0;
                var yOfs = 0;
                var arrowToDraw = null;

                var timeDiff = currTime - noteTime;
                if (timeDiff < 0){
                    timeDiff = -timeDiff;
                }
                imageIndex = Math.round(timeDiff / tickTime) % 4;
                // appropriate image surface, y offset
                // default
                if (bujs.game_.chance_ === 0) {
                    switch (noteKey) {
                        case 7 : arrowToDraw = _this.sprites_.a7_[imageIndex]; yOfs = _this.consts_.lane1Yofs_; break;
                        case 4 : arrowToDraw = _this.sprites_.a4_[imageIndex]; yOfs = _this.consts_.lane2Yofs_; break;
                        case 1 : arrowToDraw = _this.sprites_.a1_[imageIndex]; yOfs = _this.consts_.lane3Yofs_; break;
                        case 9 : leftLane = false; arrowToDraw = _this.sprites_.a9_[imageIndex]; yOfs = _this.consts_.lane1Yofs_;  break;
                        case 6 : leftLane = false; arrowToDraw = _this.sprites_.a6_[imageIndex]; yOfs = _this.consts_.lane2Yofs_; break;
                        case 3 : leftLane = false; arrowToDraw = _this.sprites_.a3_[imageIndex]; yOfs = _this.consts_.lane3Yofs_; break;
                    }
                }
                // set chance number 1 : all mid lane
                if (bujs.game_.chance_ === 1) {
                    switch (noteKey) {
                        case 7 : arrowToDraw = _this.sprites_.a7_[imageIndex]; yOfs = _this.consts_.lane2Yofs_; break;
                        case 4 : arrowToDraw = _this.sprites_.a4_[imageIndex]; yOfs = _this.consts_.lane2Yofs_; break;
                        case 1 : arrowToDraw = _this.sprites_.a1_[imageIndex]; yOfs = _this.consts_.lane2Yofs_; break;
                        case 9 : leftLane = false; arrowToDraw = _this.sprites_.a9_[imageIndex]; yOfs = _this.consts_.lane2Yofs_;  break;
                        case 6 : leftLane = false; arrowToDraw = _this.sprites_.a6_[imageIndex]; yOfs = _this.consts_.lane2Yofs_; break;
                        case 3 : leftLane = false; arrowToDraw = _this.sprites_.a3_[imageIndex]; yOfs = _this.consts_.lane2Yofs_; break;
                    }
                }
                // set chance number 2 : invert up/down
                if (bujs.game_.chance_ === 2) {
                    switch (noteKey) {
                        case 7 : arrowToDraw = _this.sprites_.a7_[imageIndex]; yOfs = _this.consts_.lane3Yofs_; break;
                        case 4 : arrowToDraw = _this.sprites_.a4_[imageIndex]; yOfs = _this.consts_.lane2Yofs_; break;
                        case 1 : arrowToDraw = _this.sprites_.a1_[imageIndex]; yOfs = _this.consts_.lane1Yofs_; break;
                        case 9 : leftLane = false; arrowToDraw = _this.sprites_.a9_[imageIndex]; yOfs = _this.consts_.lane3Yofs_;  break;
                        case 6 : leftLane = false; arrowToDraw = _this.sprites_.a6_[imageIndex]; yOfs = _this.consts_.lane2Yofs_; break;
                        case 3 : leftLane = false; arrowToDraw = _this.sprites_.a3_[imageIndex]; yOfs = _this.consts_.lane1Yofs_; break;
                    }
                }

                // draw it!
                if (arrowToDraw !== null) {
                    _this.drawArrow_(arrowToDraw, xOfs, yOfs, leftLane, noteTime);
                }
                else if (noteKey === 5) {
                    // a space?
                    var cursorLx = (_this.config_.canvasWidth_ - _this.sprites_.spaceFrameCursor_[0].width) / 2 - (noteTime - currTime)/tickTime*31.0/2;
                    var cursorRx = (_this.config_.canvasWidth_ - _this.sprites_.spaceFrameCursor_[0].width)/  2 + (noteTime - currTime)/tickTime*31.0/2;
                    var cursorY = _this.config_.canvasHeight_ - _this.consts_.spaceMarginBottom_ - _this.sprites_.spaceFrameCursor_[0].height / 2;
                    _this.setSpritePos_(_this.sprites_.spaceFrameCursor_[0], cursorLx, cursorY);
                    _this.drawSprite_(_this.sprites_.spaceFrameCursor_[0]);

                    _this.setSpritePos_(_this.sprites_.spaceFrameCursor_[0], cursorRx, cursorY);
                    _this.drawSprite_(_this.sprites_.spaceFrameCursor_[0]);
                }
            }
        }
    }
};

/**
 * Draw note result big text (p/g/c/b/m) on top
 */
BUJS.Renderer_.prototype.drawBigNoteResultText_ = function () {
    var _this = this;
    if (bujs.game_.lastNoteTime_ > 0) {
        var diff = bujs.game_.music_.getCurrTime_() - bujs.game_.lastNoteTime_;
        var noteResult = _this.sprites_.noteResults_[bujs.game_.lastNoteResult_];

        // result width / height
        var ratio = 1;
        if (diff < 50) ratio = 1 + (50 - diff) / 90;

        // draw it with ratio
        _this.setSpritePos_(noteResult, (_this.config_.canvasWidth_ - noteResult.width * ratio) / 2, (_this.consts_.baseResultLine_ - noteResult.height * ratio) / 2);
        _this.drawSprite_(noteResult, ratio);

        if (diff > 200) {
            bujs.game_.lastNoteResult_ = 0;
            bujs.game_.lastNoteTime_ = 0;
        }
    }
};;BUJS.Input_ = function () {
    var _this = this;
    $("body")[0].onkeydown = function (e) {
        var keyCode = e.keyCode;
        _this.checkKeyboard_(keyCode);
    };
    var el = document.getElementsByTagName("canvas")[0];
    el.addEventListener("touchstart", function (e) {
        _this.touchStart_(e);
    }, false);
    if (bujs.iOS_) {
        el.addEventListener("touchend", function (e) {
            _this.touchEnd_(e);
        }, false);
    }
};

BUJS.Input_.prototype.checkKeyboard_ = function (keyCode) {
    var _this = this;
    switch (keyCode) {
        case 112:   // f1: toggle help
            bujs.game_.showHelp_ = !bujs.game_.showHelp_;
            break;
        case 113:   // f2: save replay
            break;
        case 114:   // f3: chance
            bujs.game_.chance_ = (bujs.game_.chance_ + 1) % 3;
            break;
        case 115:   // f4: background
            bujs.game_.showBg_ = (bujs.game_.showBg_ + 1) % (bujs.game_.renderer_.sprites_.background_.length + 1);
            break;
        case 16:    // lshift: toggle arrow perfect position
            bujs.game_.showPerfArrows_ = !bujs.game_.showPerfArrows_;
            break;
        case 93:    // rcommand/rwin: toggle autoplay
            bujs.game_.autoplay_ = !bujs.game_.autoplay_;
        case 55:    // 7
        case 82:    // r
        case 103:   // numpad7
        case 36:    // home
            if (!bujs.game_.autoplay_) _this.keyDown_(7);
            break;
        case 52:    // 4
        case 70:    // f
        case 100:   // numpad4
        case 37:    // left
            if (!bujs.game_.autoplay_) _this.keyDown_(4);
            break;
        case 49:    // 1
        case 86:    // v
        case 97:    // numpad1
        case 35:    // en
            if (!bujs.game_.autoplay_) _this.keyDown_(1);
            break;
        case 57:    // 9
        case 73:    // i
        case 105:   // numpad9
        case 33:    // pg up
            if (!bujs.game_.autoplay_) _this.keyDown_(9);
            break;
        case 54:    // 6
        case 75:    // k
        case 102:   // numpad6
        case 39:    // right
            if (!bujs.game_.autoplay_) _this.keyDown_(6);
            break;
        case 51:    // 3
        case 78:    // n
        case 99:    // numpad3
        case 34:    // pg dn
            if (!bujs.game_.autoplay_) _this.keyDown_(3);
            break;
        case 48:    // 9
        case 53:    // 5
        case 32:    // space
        case 96:    // numpad0
        case 101:   // numpad5
            if (!bujs.game_.autoplay_) _this.keyDown_(5);
            break;

    }
};

BUJS.Input_.prototype.keyDown_ = function (keyMap) {
    var leftLane = true;
    var spriteLaneIndex = -1;
    var xOfs = 0;
    var xOfsBeat = 0;
    var yOfs = 0;
    var yOfsBeat = 0;
    switch (keyMap) {
        case 7 : spriteLaneIndex = 0; yOfs = bujs.game_.renderer_.consts_.lane1Yofs_; break;
        case 4 : spriteLaneIndex = 1; xOfsBeat = 6; yOfs = bujs.game_.renderer_.consts_.lane2Yofs_; break;
        case 1 : spriteLaneIndex = 2; yOfs = bujs.game_.renderer_.consts_.lane3Yofs_; break;
        case 9 : spriteLaneIndex = 3; leftLane = false; yOfs = bujs.game_.renderer_.consts_.lane1Yofs_; break;
        case 6 : spriteLaneIndex = 4; leftLane = false; xOfsBeat = -5; yOfs = bujs.game_.renderer_.consts_.lane2Yofs_; break;
        case 3 : spriteLaneIndex = 5; leftLane = false; yOfs = bujs.game_.renderer_.consts_.lane3Yofs_; break;
    }
    if (spriteLaneIndex >= 0) {
        if (leftLane) {
            xOfs = bujs.game_.renderer_.consts_.tableWidth_ - bujs.game_.renderer_.consts_.tableWidthTrans_ - bujs.game_.renderer_.consts_.chanceDist_ - bujs.game_.renderer_.consts_.arrowLaneOfs_;
            xOfsBeat = xOfsBeat + bujs.game_.renderer_.consts_.tableWidth_ - bujs.game_.renderer_.consts_.tableWidthTrans_ + bujs.game_.renderer_.consts_.laneWidth_ - bujs.game_.renderer_.consts_.chanceDist_ + bujs.game_.renderer_.consts_.arrowLaneOfs_;
        }
        else {
            xOfs = bujs.game_.renderer_.config_.canvasWidth_ - (bujs.game_.renderer_.consts_.tableWidth_ - bujs.game_.renderer_.consts_.chanceDist_ + bujs.game_.renderer_.consts_.laneWidth_ - bujs.game_.renderer_.consts_.arrowLaneOfs_ + bujs.game_.renderer_.sprites_.a1_[0].width + 3);	// 3 is a little weird here.
            xOfsBeat = xOfsBeat + bujs.game_.renderer_.config_.canvasWidth_ - (bujs.game_.renderer_.consts_.tableWidth_ - bujs.game_.renderer_.consts_.tableWidthTrans_ + bujs.game_.renderer_.consts_.laneWidth_ - bujs.game_.renderer_.consts_.chanceDist_ + bujs.game_.renderer_.consts_.arrowLaneOfs_ + bujs.game_.renderer_.sprites_.a1_[0].width + 1);
        }
        yOfsBeat = yOfs + bujs.game_.renderer_.consts_.laneYStart_ + bujs.game_.renderer_.sprites_.a1_[0].height / 2 - bujs.game_.renderer_.sprites_.beatDown_[0].height / 2;
        yOfs = yOfs + bujs.game_.renderer_.consts_.laneYStart_ + bujs.game_.renderer_.sprites_.a1_[0].height / 2 - bujs.game_.renderer_.sprites_.laneDown_[0].height / 2;

        // lane
        bujs.game_.animations_.push(new BUJS.Animation_(bujs.game_.renderer_, bujs.game_.music_.getCurrTime_(), bujs.game_.renderer_.consts_.arrowAnimationTime_, bujs.game_.renderer_.sprites_.laneDown_[spriteLaneIndex], xOfs, yOfs));

        // beat
        bujs.game_.animations_.push(new BUJS.Animation_(bujs.game_.renderer_, bujs.game_.music_.getCurrTime_(), bujs.game_.renderer_.consts_.arrowAnimationTime_, bujs.game_.renderer_.sprites_.beatDown_[spriteLaneIndex], xOfsBeat, yOfsBeat));
    }

    // space down
    if (keyMap === 5) {
        bujs.game_.animations_.push(new BUJS.Animation_(bujs.game_.renderer_, bujs.game_.music_.getCurrTime_(),
            bujs.game_.renderer_.consts_.arrowAnimationTime_,
            bujs.game_.renderer_.sprites_.spaceFrameExplode_[0],
            (bujs.game_.renderer_.config_.canvasWidth_ - bujs.game_.renderer_.sprites_.spaceFrameExplode_[0].width) / 2,
            bujs.game_.renderer_.config_.canvasHeight_ - bujs.game_.renderer_.consts_.spaceMarginBottom_ - bujs.game_.renderer_.sprites_.spaceFrameExplode_[0].height / 2));
    }

    bujs.game_.processNoteResult_(keyMap);
};

BUJS.Input_.prototype.touchStart_ = function (e) {
    e.preventDefault();
    var _this = this;
    var el = e.changedTouches[0].target,
        elLeft = el.offsetLeft,
        elTop = el.offsetTop,
        arrowSprite = bujs.game_.renderer_.sprites_.a7_[0],
        spaceFrameSprite = bujs.game_.renderer_.sprites_.spaceFrame_[0],
        logoSprite = bujs.game_.renderer_.sprites_.dnxpLogo_[0];
    var leftPerfectX = bujs.game_.renderer_.consts_.tableWidth_ - bujs.game_.renderer_.consts_.tableWidthTrans_ +
                        bujs.game_.renderer_.consts_.laneWidth_ - bujs.game_.renderer_.consts_.chanceDist_ +
                        bujs.game_.renderer_.consts_.arrowLaneOfs_;
    var rightPerfectX = bujs.game_.renderer_.config_.canvasWidth_ -
                        (bujs.game_.renderer_.consts_.tableWidth_ - bujs.game_.renderer_.consts_.tableWidthTrans_ +
                            bujs.game_.renderer_.consts_.laneWidth_ - bujs.game_.renderer_.consts_.chanceDist_ +
                            bujs.game_.renderer_.consts_.arrowLaneOfs_ + arrowSprite.width);
    var spaceLeft = (bujs.game_.renderer_.config_.canvasWidth_ - spaceFrameSprite.width) / 2,
        spaceTop = bujs.game_.renderer_.config_.canvasHeight_ - bujs.game_.renderer_.consts_.spaceMarginBottom_ - spaceFrameSprite.height / 2;

    for (var i = 0; i < e.changedTouches.length; i++) {
        var touch = e.changedTouches[i],
            touchLeft = touch.pageX - elLeft,
            touchTop = touch.pageY - elTop;
        var key = 0;

        var row = 0;
        if (touchTop >= bujs.game_.renderer_.consts_.laneYStart_ + bujs.game_.renderer_.consts_.lane1Yofs_ &&
            touchTop <= bujs.game_.renderer_.consts_.laneYStart_ + bujs.game_.renderer_.consts_.lane1Yofs_ + arrowSprite.height) {
            row = 1;
        }
        if (touchTop >= bujs.game_.renderer_.consts_.laneYStart_ + bujs.game_.renderer_.consts_.lane2Yofs_ &&
            touchTop <= bujs.game_.renderer_.consts_.laneYStart_ + bujs.game_.renderer_.consts_.lane2Yofs_ + arrowSprite.height) {
            row = 2;
        }
        if (touchTop >= bujs.game_.renderer_.consts_.laneYStart_ + bujs.game_.renderer_.consts_.lane3Yofs_ &&
            touchTop <= bujs.game_.renderer_.consts_.laneYStart_ + bujs.game_.renderer_.consts_.lane3Yofs_ + arrowSprite.height) {
            row = 3;
        }

        var leftRight = 0;
        if ((touchLeft >= leftPerfectX &&
             touchLeft <= leftPerfectX + arrowSprite.width) ||
            (touchLeft >= 0 &&
             touchLeft <= bujs.game_.renderer_.sprites_.tableL_[0].width)) {
            leftRight = 1;
        }
        if ((touchLeft >= rightPerfectX &&
             touchLeft <= rightPerfectX + arrowSprite.width) ||
            (touchLeft >= bujs.game_.renderer_.config_.canvasWidth_ - bujs.game_.renderer_.sprites_.tableR_[0].width &&
             touchLeft <= bujs.game_.renderer_.config_.canvasWidth_)) {
            leftRight = 2;
        }

        if (row === 1 && leftRight === 1) key = 7;
        else if (row === 2 && leftRight === 1) key = 4;
        else if (row === 3 && leftRight === 1) key = 1;
        else if (row === 1 && leftRight === 2) key = 9;
        else if (row === 2 && leftRight === 2) key = 6;
        else if (row === 3 && leftRight === 2) key = 3;

        if (touchLeft >= spaceLeft && touchLeft <= spaceLeft + spaceFrameSprite.width &&
            touchTop >= spaceTop && touchTop <= spaceTop + spaceFrameSprite.height) {
            key = 5;
        }

        if (touchLeft >= 0 && touchLeft <= logoSprite.width &&
            touchTop >= bujs.game_.renderer_.config_.canvasHeight_ - logoSprite.height && touchTop <= bujs.game_.renderer_.config_.canvasHeight_) {
            key = 5;
        }

        if (touchLeft >= bujs.game_.renderer_.config_.canvasWidth_ - logoSprite.width && touchLeft <= bujs.game_.renderer_.config_.canvasWidth_ &&
            touchTop >= bujs.game_.renderer_.config_.canvasHeight_ - logoSprite.height && touchTop <= bujs.game_.renderer_.config_.canvasHeight_) {
            key = 5;
        }


        if (key !== 0) {
            _this.keyDown_(key);
        }
    }

};

BUJS.Input_.prototype.touchEnd_ = function (e) {
    var _music = bujs.game_.music_;
    // TODO: BUM thingies...
    if (typeof _music.musicStartTime_ === 'undefined' || _music.musicStartTime_ === null) {
        _music.context_.decodeAudioData(_music.response_.slice(0), function (buffer) {
            _music.musicSource_ = _music.loadSound_(buffer);
            _music.musicStartTime_ = _music.context_.currentTime;
            _music.musicSource_.start(0);
            if (typeof _music.onComponentFinishLoading_ !== 'undefined') {
                _music.onComponentFinishLoading_.call(bujs.game_, _music);
            }
        }, function (error) {
            console.error("Error decoding audio data", error);
        });
    }
};;/**
 * A simple animation interpolation utility
 */
BUJS.Animation_ = function (renderer, startTime, duration, sprite, x, y) {
    this.renderer_ = renderer;
    this.startTime_ = startTime;
    this.duration_ = duration || bujs.game_.renderer_.consts_.arrowAnimationTime_;
    this.sprite_ = sprite || null;
    this.x_ = x || 0;
    this.y_ = y || 0;
}

/**
 * We can apply different interpolation algorithms here.
 * For now it's linear interpolation
 */
BUJS.Animation_.prototype.interpolate_ = function (currTime) {
    var _this = this;
    var alpha = 1 - (currTime - _this.startTime_) / _this.duration_;
    return alpha;
};

/**
 * Process a predefined animation
 */
BUJS.Animation_.prototype.process_ = function (currTime) {
    var _this = this;
    if (_this.sprite_ == null) return;
    if (_this.startTime_ + _this.duration_ > currTime) {
        if (_this.startTime_ <= currTime) {
            // equivalent to setSpritePos_()
            _this.sprite_.pos = {x: _this.x_, y: _this.y_};
            _this.renderer_.ctx_.globalAlpha = _this.interpolate_(currTime);
            _this.renderer_.drawSprite_(_this.sprite_);
            _this.renderer_.ctx_.globalAlpha = 1;
        }
    }
    else {
        _this.startTime_ = -1;
    }
};;BUJS.Game_ = function (songId) {
    var _this = this;
    this.songId_ = songId;
    this.loadedComponent_ = [];

    this.frameCount_ = 0;
    this.fps_ = 0;

    this.firstAvailNote_ = 0;
    this.lastNoteResult_ = 0;
    this.lastNoteTime_ = 0;
    this.lastTime_ = 0;

    this.pgcbm_ = [0, 0, 0, 0, 0];
    this.score_ = 0;
    this.perx_ = 0;
    this.combo_ = 0;
    this.xmax_ = 0;
    this.chance_ = 0;

    this.showBg_ = 0;
    this.showPerfArrows_ = false;
    this.showHelp_ = false;

    this.numSelect_ = 0;
    this.animations_ = [];
    this.players_ = [];

    this.autoplay_ = false;
    this.alwaysCorrect_ = false;

    this.noteScores_ = [480, 240, 120, 60, 0];
    this.spaceScore_ = 2000;
    this.yellowBeatupRatio_ = 1.2;
    this.blueBeatupRatio_ = 1.44;


    // load music and renderer
    setTimeout(function () {
        _this.music_ = new BUJS.Music_(_this.onComponentFinishLoading_);
    }, 0);

    this.renderer_ = new BUJS.Renderer_(this.onComponentFinishLoading_);
    this.renderer_.asyncLoadSprites_();
    this.input_ = new BUJS.Input_();
};

/**
 * Callback whenever we have a component finished loading
 */
BUJS.Game_.prototype.onComponentFinishLoading_ = function (component) {
    var _this = this;
    if (typeof component !== "undefined") {
        var componentType = component.constructor.name;
        console.log("Component finished loading", componentType);
        if (_this.loadedComponent_.indexOf(component) < 0) {
            _this.loadedComponent_.push(componentType);
        }
        if (_this.loadedComponent_.length === 2) {     // renderer & music
            // initialize remaining animation parameters
            _this.onFinishLoading_();
        }
    }
};

/**
 * Callback whenever we have ALL components finished loading
 */
BUJS.Game_.prototype.onFinishLoading_ = function () {
    gl_();
};

function gl_() {
    bujs.game_.loop_();
}

/**
 * Main game loop
 */
BUJS.Game_.prototype.loop_ = function () {
    var _this = this;
    _this.update_();
    _this.draw_();
    if (_this.music_.context_ !== null) {
        window.requestAnimationFrame(gl_);
    }
};

/**
 * Draw the whole scene
 */
BUJS.Game_.prototype.draw_ = function () {
    var _this = this;
    _this.renderer_.clear_();

    if (bujs.game_.showBg_ !== 0) {
        _this.renderer_.drawSprite_(_this.sprites_.background_[bujs.game_.showBg_ - 1]);
    }

    if (typeof _this.music_.musicStartTime_ === 'undefined' || _this.music_.musicStartTime_ === null) {
        bujs.showLoadingMsg_("Touch/click to start music");
    }

    // fps
    var fps = _this.calcFps_();
    var posFps = {x: 5, y: 15};
    _this.renderer_.writeText_(posFps, fps.toFixed(1));
    _this.renderer_.writeText_({x: 5, y: _this.renderer_.config_.canvasHeight_ - 5}, _this.music_.getCurrTime_().toFixed(2));

    // song name
    _this.renderer_.writeText_({x: 5, y: _this.renderer_.config_.canvasHeight_ - 5 - 16}, _this.music_.songInfo_.name + " - " + _this.music_.songInfo_.singer + " [" + _this.music_.songInfo_.bpm.toFixed(1) + " bpm]");

    // lanes, landings, icons, logo, space frame...
    _this.renderer_.drawFixContent_(_this.combo_);
    _this.renderer_.drawBeatupText_(_this.combo_);

    if (_this.showPerfArrows_) {
        _this.renderer_.drawPerfectArrows_();
    }
    _this.processAnimations_();
    _this.renderer_.drawNotes_(_this.music_.getCurrTime_());
    _this.renderer_.drawBigNoteResultText_();

    _this.checkMiss_();

    _this.renderer_.drawTable_();
    _this.renderer_.drawTouchArrows_();
};

/**
 * Update game status
 */
BUJS.Game_.prototype.update_ = function () {
    var _this = this;

};

/**
 * Calculate frame per sec, not from beginning but for each sec
 */
BUJS.Game_.prototype.calcFps_ = function () {
    var _this = this;
    var currTime = _this.music_.getCurrTime_();
    _this.frameCount_ ++;
    if (_this.lastTime_ === 0) {
        _this.lastTime_ = currTime;
    }
    if (currTime > _this.lastTime_ + 1000) {
        _this.fps_ = _this.frameCount_ / (currTime - _this.lastTime_) * 1000;
        _this.lastTime_ = currTime;
        _this.frameCount_ = 0;
    }
    return _this.fps_;
};

BUJS.Game_.prototype.checkMiss_ = function () {
    var _this = this;
    var currTime = _this.music_.getCurrTime_();
    var maxNotes = Math.min(_this.firstAvailNote_ + _this.renderer_.consts_.numNotes_, _this.music_.songInfo_.notes_.length);
    if (_this.autoplay_) {
        if (_this.firstAvailNote_ >= 0) {
            // still have notes
            for (var i = _this.firstAvailNote_; i < maxNotes; i++) {
                if (_this.music_.songInfo_.notes_[i].t < currTime + 5) {
                    _this.input_.keyDown_(_this.music_.songInfo_.notes_[i].n);
                    //processKeyboard(true, 0, -1);

                    break;
                }
            }
        }
    }
    else {
        // check for misses
        if (_this.firstAvailNote_ >= 0) {
            // still have notes
            for (i = _this.firstAvailNote_; i < maxNotes; i++) {
                if (currTime > _this.music_.songInfo_.notes_[i].t + _this.music_.tickTime_ * 2) {
                    _this.music_.songInfo_.notes_[i].pressed_ = true;
                    _this.lastNoteResult_ = 4;		// 'missed' for the animation
                    _this.lastNoteTime_ = currTime;
                    _this.music_.playSound_(_this.music_.sounds_.miss_);
                    _this.updateScore_(_this.music_.songInfo_.notes_[i].n, 4);
                }
            }
        }

        // recalculate first_avail_note
        _this.firstAvailNote_ = -1;
        for (var j = 0; j < _this.music_.songInfo_.notes_.length; j++) {
            if (!_this.music_.songInfo_.notes_[j].pressed_) {
                _this.firstAvailNote_ = j;
                break;
            }
        }
    }
};

BUJS.Game_.prototype.processNoteResult_ = function (keyMap) {
    var _this = this;
    var noteResult = -1;
    if (keyMap !== 0 || _this.autoplay_) {
        var currTime = _this.music_.getCurrTime_();
        for (var i = _this.firstAvailNote_; i < _this.firstAvailNote_ + 4; i++) {
            if (_this.firstAvailNote_ >= _this.music_.songInfo_.notes_.length || _this.firstAvailNote_ < 0) break;
            var note = _this.music_.songInfo_.notes_[i];
            var noteKey = note.n;
            var keyTime = currTime - note.t;

            if (noteKey === keyMap || _this.autoplay_ || _this.alwaysCorrect_) {
                noteResult = _this.getKeyResult_(keyTime);
                if (noteKey === 5) {
                    _this.animations_.push(new BUJS.Animation_(_this.renderer_, currTime, _this.renderer_.consts_.arrowAnimationTime_, _this.renderer_.sprites_.spaceFrameExplode_[0],
                        (_this.renderer_.config_.canvasWidth_ - _this.renderer_.sprites_.spaceFrameExplode_[0].width) / 2,
                        _this.renderer_.config_.canvasHeight_ - _this.renderer_.consts_.spaceMarginBottom_ - _this.renderer_.sprites_.spaceFrameExplode_[0].height / 2));
                }
                // not an "outside" key? a correct key?
                if (noteResult >= 0 || _this.autoplay_) {
                    switch (noteKey){
                        case 5 : _this.animations_.push(new BUJS.Animation_(_this.renderer_, currTime, _this.renderer_.consts_.arrowAnimationTime_, _this.renderer_.sprites_.spaceExplode_[0],
                            (_this.renderer_.config_.canvasWidth_ - _this.renderer_.sprites_.spaceExplode_[0].width) / 2,
                            _this.renderer_.config_.canvasHeight_ - _this.renderer_.consts_.spaceMarginBottom_ - _this.renderer_.sprites_.spaceExplode_[0].height / 2));
                            break;
                    }
                    if (noteResult !== 4) {
                        if (noteKey !== 5) {
                            var leftLane = true;
                            var yOfs = 0;

                            // appropriate image surface, y offset
                            switch (noteKey) {
                                case 7 : yOfs = _this.renderer_.consts_.lane1Yofs_; break;
                                case 4 : yOfs = _this.renderer_.consts_.lane2Yofs_; break;
                                case 1 : yOfs = _this.renderer_.consts_.lane3Yofs_; break;
                                case 9 : leftLane = false; yOfs = _this.renderer_.consts_.lane1Yofs_; break;
                                case 6 : leftLane = false; yOfs = _this.renderer_.consts_.lane2Yofs_; break;
                                case 3 : leftLane = false; yOfs = _this.renderer_.consts_.lane3Yofs_; break;
                            }
                            yOfs = _this.renderer_.consts_.laneYStart_ + yOfs + _this.renderer_.sprites_.a1_[0].height / 2;
                            if (leftLane)
                                _this.animations_.push(new BUJS.Animation_(_this.renderer_, currTime, _this.renderer_.consts_.arrowAnimationTime_, _this.renderer_.sprites_.arrowExplode_[0],
                                    _this.renderer_.consts_.tableWidth_ - _this.renderer_.consts_.tableWidthTrans_ + _this.renderer_.consts_.laneWidth_ - _this.renderer_.consts_.chanceDist_ + _this.renderer_.consts_.arrowLaneOfs_ + _this.renderer_.sprites_.a1_[0].width / 2 - _this.renderer_.sprites_.arrowExplode_[0].width / 2,
                                    yOfs - _this.renderer_.sprites_.arrowExplode_[0].width / 2));
                            else
                                _this.animations_.push(new BUJS.Animation_(_this.renderer_, currTime, _this.renderer_.consts_.arrowAnimationTime_, _this.renderer_.sprites_.arrowExplode_[0],
                                    _this.renderer_.config_.canvasWidth_ - (_this.renderer_.consts_.tableWidth_ - _this.renderer_.consts_.tableWidthTrans_ + _this.renderer_.consts_.laneWidth_ - _this.renderer_.consts_.chanceDist_ + _this.renderer_.consts_.arrowLaneOfs_ + _this.renderer_.sprites_.a1_[0].width / 2) - _this.renderer_.sprites_.arrowExplode_[0].width / 2,
                                    yOfs - _this.renderer_.sprites_.arrowExplode_[0].height / 2));
                        }
                    }

                    // sound
                    if (noteKey === 5) _this.music_.playSound_(_this.music_.sounds_.space_);
                    else if (noteResult === 0) _this.music_.playSound_(_this.music_.sounds_.perfect_);  // arrow per?
                    else if (noteResult === 4) _this.music_.playSound_(_this.music_.sounds_.miss_);     // arrow miss?
                    else _this.music_.playSound_(_this.music_.sounds_.normal_);                         // arrow normal

                    // update pgcbm, score, combo, perx... and send to server if it's a space
                    _this.updateScore_(noteKey, noteResult);

                    // mark it as pressed
                    note.pressed_ = true;

                    // recalculate first_avail_note
                    _this.firstAvailNote_ = -1;
                    for (var j = 0; j < _this.music_.songInfo_.notes_.length; j++) {
                        if (typeof _this.music_.songInfo_.notes_[j].pressed_ === "undefined" || !_this.music_.songInfo_.notes_[j].pressed_) {
                            _this.firstAvailNote_ = j;
                            break;
                        }
                    }

                    // save note result for p/g/c/b/m animation
                    _this.lastNoteResult_ = noteResult;
                    _this.lastNoteTime_ = currTime;

                    // that's enough. found a note. break.
                    break;
                }
            }
        }
    }
};

/**
 * Convert time diff to key result p/g/c/b/m
 */
BUJS.Game_.prototype.getKeyResult_ = function (diff) {
    var _this = this;
    if (_this.autoplay_) return 0;
    var ratio = 4;
    var tickTime = _this.music_.tickTime_;
    if (diff > 80 * (tickTime * ratio) / 100 || diff < -tickTime * ratio) return -1;	// don't process
    if (diff < 0) {
        diff = -diff;
    }
    if (diff <= 5 * (tickTime * ratio) / 100) return 0;		// p
    if (diff <= 15 * (tickTime * ratio) / 100) return 1;	// g
    if (diff <= 27 * (tickTime * ratio) / 100) return 2;	// c
    if (diff <= 40 * (tickTime * ratio) / 100) return 3;	// b
    return 4;												// m
};

/**
 * Process all on-going animations
 */
BUJS.Game_.prototype.processAnimations_ = function () {
    var _this = this;
    for (var i = 0; i < _this.animations_.length; i++) {
        _this.animations_[i].process_(_this.music_.getCurrTime_());
    }
    // delete all finished animations
    for (i = _this.animations_.length - 1; i >= 0; i--) {
        if (_this.animations_[i].startTime_ < 0) {
            _this.animations_.splice(i, 1);
        }
    }
};

/**
 * Add/reset combo, add score, perx, p/g/c/b/m counters,...
 */
BUJS.Game_.prototype.updateScore_ = function (key, keyResult) {
    var _this = this;
    var noteScore = 0;
    if (key === 5) {
        if (keyResult >= 0 && keyResult !== 4) {
            noteScore = _this.spaceScore_;
        }
    }
    else {
        if (keyResult >= 0) {
            noteScore = _this.noteScores_[keyResult];
        }
    }

    // ratios with BEATUP
    if (_this.combo_ >= 400) noteScore *= _this.blueBeatupRatio_;
    else if (_this.combo_ >= 100) noteScore *= _this.yellowBeatupRatio_;
    _this.score_ += noteScore;

    // result : pgcbm
    _this.pgcbm_[keyResult]++;

    // update combo
    //var prevCombo = _this.combo_;
    if (keyResult !== 4 && keyResult >= 0) _this.combo_++;
    else _this.combo_ = 0;

    // update perx
    if (_this.lastNoteResult_ === 0 && keyResult === 0) {		// still per?
        _this.perx_++;
    }
    else _this.perx_ = 0;

    if (_this.perx_ > _this.xmax_){
        _this.xmax_ = _this.perx_;
    }

    // TODO: send to server
};;function BUJS () {
}

BUJS.prototype.start_ = function () {
    var _this = this;

    // draw some "loading" things...
    _this.initCanvas_();
    _this.showLoadingMsg_("Loading extra UI components");

    // load extra contents
    $.get('template/modal.html', function (html) {
        $('#template-container').html(html);
        _this.loadSongList_();
    });

    _this.iOS_ = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
};

BUJS.prototype.loadTemplate_ = function (id) {
    var t = document.querySelector(id);
    var clone = document.importNode(t.content, true);
    document.body.appendChild(clone);
};

BUJS.prototype.showLogin_ = function () {
    var login = $('#login-modal');
    login.on("shown.bs.modal", function () {
        login.find("#username").focus();
    });
    login.modal('show');
};

BUJS.prototype.loadSongList_ = function () {
    var _this = this;
    _this.showLoadingMsg_("Loading songs");
    // fetch list from server
    $.get("notes/list.json", function (list) {
        console.log("song list: ", list);
        _this.songList_ = list;
        _this.showSongListModal_();
    });
};

BUJS.prototype.showSongListModal_ = function () {
    var _this = this;
    _this.showLoadingMsg_("");
    _this.loadTemplate_("#songlist-template");
    var songlistModal = $('#songlist-modal');
    var songlistContainer = songlistModal.find("#songlist-container");
    for (var id in _this.songList_) {
        var song = _this.songList_[id];
        var li = document.createElement("li");
        li.setAttribute("class", "songListItem");
        li.setAttribute("songid", id);
        li.innerText = "[" + song.bpm.toFixed(1) + "] " + song.singer + " " + song.name + " (" + song.slkauthor + ")";
        li.onclick = _this.songItemClick_;
        songlistContainer.append(li);
    }
    songlistModal.modal("show");
};

BUJS.prototype.initCanvas_ = function () {
    var canvas = document.getElementById("cvs");
    canvas.width = 980;
    canvas.height = 400;
};

BUJS.prototype.songItemClick_ = function () {
    var songId = this.getAttribute("songid");
    bujs.game_ = new BUJS.Game_(songId);
    $('#songlist-modal').modal("hide");
};

BUJS.prototype.showLoadingMsg_ = function (msg) {
    var canvas = document.getElementById("cvs");
    var ctx = canvas.getContext("2d");
    var width = canvas.width;
    var height = canvas.height;
    ctx.fillStyle = "black";
    ctx.clearRect(0, 0, width, height);
    ctx.font = "12px Arial";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText(msg, width / 2, height / 2);
};

bujs = new BUJS();
$(window).on('load', function () {
    bujs.start_();
});
