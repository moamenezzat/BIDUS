var slideDuration = 3,
  slideAnimation = 0.5,
  slider = $(".slider"),
  slides = $(".slider__slide"),
  leftControl = $(".slider__control.left"),
  rightControl = $(".slider__control.right"),
  indicators = $(".slider__indicator"),
  x = slides.eq(0).width(),
  t = TweenLite;

// Slider Helper Functions
function before(e) {
  new t.set(e, { css: { zIndex: 1, transform: "translateX(0)" } });
}
function after(e) {
  new t.set(e, {
    css: { zIndex: 1 }
  });
  new t.set(e, {
    x: 2 * x
  });
}
function animateForwards(e, callback) {
  new t.set(e, {
    css: { zIndex: 2 }
  });
  new t.to(e, slideAnimation, { x: 2 * x, onComplete: callback });
}
function animateIn(e, callback, params) {
  t.set(e, {
    css: {
      zIndex: 2
    }
  });
  t.to(e, slideAnimation, {
    x: x,
    onComplete: callback,
    onCompleteParams: params.length ? params : [e]
  });
}
function animateBackwards(e, callback) {
  new t.set(e, {
    css: { zIndex: 2 }
  });
  t.to(e, slideAnimation, { x: 0, onComplete: callback });
}
function playIndicator(e, callback) {
  new t.set(e, {
    transformOrigin: "left center"
  });
  return new t.to(e, slideDuration, {
    scaleX: 1,
    onComplete: callback
  });
}
function endIndicator(e) {
  new t.set(e, {
    transformOrigin: "right center"
  });
  new t.to(e, slideAnimation, { scaleX: 0 });
}
function revertIndicator(e) {
  new t.set(e, {
    transformOrigin: "left center"
  });
  new t.to(e, slideAnimation, { scaleX: 0 });
}
function flipSliderForward(callback) {
  var current = $(".slider__slide.current"),
    index = slides.index(current[0]),
    currentIndicator = indicators.eq(index),
    nextSlide =
      index === slides.length - 1 ? slides.eq(0) : slides.eq(index + 1),
    nextIndicator =
      index === slides.length - 1 ? indicators.eq(0) : indicators.eq(index + 1);
  current.removeClass("current");
  nextSlide.addClass("current");
  before(nextSlide);
  endIndicator(currentIndicator.find(".filler"));
  animateIn(nextSlide, playIndicator, [nextIndicator.find(".filler")]);
  animateForwards(current, function() {
    before(current);
    callback ? callback() : null;
  });
}
function flipSliderbackword(callback) {
  var current = $(".slider__slide.current"),
    index = slides.index(current[0]),
    currentIndicator = indicators.eq(index),
    nextSlide =
      index === 0 ? slides.eq(slides.length - 1) : slides.eq(index - 1),
    nextIndicator =
      index === 0
        ? indicators.eq(indicators.length - 1)
        : indicators.eq(index - 1);
  current.removeClass("current");
  nextSlide.addClass("current");
  after(nextSlide);
  revertIndicator(currentIndicator.find(".filler"));
  animateIn(nextSlide, playIndicator, [nextIndicator.find(".filler")]);
  animateBackwards(current, function() {
    before(current);
    callback ? callback() : null;
  });
}

$(function() {
  // setup slider
  before(slides.not(".current"));
  t.set($(".current"), {
    x: x
  });
  t.set($(".current"), {
    css: { zIndex: 2 }
  });
});
$(window).on("load", function() {
  // intialize slider
  playIndicator(indicators.eq(0).find(".filler"));
  timer = setInterval(flipSliderForward, slideDuration * 1000);
});

// slider controlls actions
rightControl.on("click", function() {
  clearInterval(timer);
  before($(".current").prev());
  flipSliderForward(function() {
    timer = setInterval(flipSliderForward, slideDuration * 1000);
  });
});

leftControl.on("click", function() {
  clearInterval(timer);
  after($(".current").next());
  flipSliderbackword(function() {
    timer = setInterval(flipSliderForward, slideDuration * 1000);
  });
});
