var navMain = document.querySelector(".main-nav");
var navToggle = document.querySelector(".main-nav__toggle");

navToggle.addEventListener("click", function () {
    
    if (navMain.classList.contains("main-nav--closed")) {
        navMain.classList.remove("main-nav--closed");
    } else {
        navMain.classList.add("main-nav--closed");
    }
});



var slideIndex = 1;
showSlides(slideIndex);


function plusSlides(n) {
  showSlides(slideIndex += n);
}


function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  var i;
  var slides = document.getElementsByClassName("slider__item");
  var dots = document.getElementsByClassName("slider__toggle");
  if (n > slides.length) {slideIndex = 1}
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
      dots[i].className = dots[i].className.replace(" slider__toggle--active", "");
  }
  slides[slideIndex-1].style.display = "flex";
  dots[slideIndex-1].className += " slider__toggle--active";
}

function init(ymaps) {
  
    let map = new ymaps.Map('map', {
      center: [59.93894457, 30.32402113],
      zoom: 16,
      controls: []
    });
  
    let placemark = new ymaps.Placemark(
      [59.93867682348719, 30.323043771163896],
      {},
      {
        iconLayout: 'default#image',
        iconImageHref: 'img/icon/icon-map-marker.svg',
        iconImageSize: [35, 35],
        iconImageOffset: [-17.5, -17.5]
      }
    );
  
    let zoomControl = new ymaps.control.ZoomControl({
      options: {
        position: {
          left: 10,
          bottom: 50
        }
      }
    });
  
    map.behaviors.disable('scrollZoom');
    map.geoObjects.add(placemark);
    map.controls.add(zoomControl);
  }


