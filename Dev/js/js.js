window.onload = function(){

const viewport = document.querySelector('#layer3');
const content = document.querySelector('.grid-layer3');


let sb = new ScrollBooster({
    viewport,
    bounce: false,
    scrollMode: 'transform',
    textSelection: false,
});

sb.setPosition({ x: 2500, y: 2500 });
 
$(document).ready(function(){
  $(".explore-fonts-area").click(function(){
    $(".cache-homepage").addClass("cache-homepage-hide");
    $(".main-input-block").addClass("main-input-block-hide");
    $(".explore-fonts-area").addClass("explore-fonts-area-hide");
    $(".main-input-label").addClass("main-input-label-hide");
    // $( ".main-input-label" ).remove(".main-input-label");
  });
});

$(document).ready(function(){
  $(".cards").click(function(){
    $(".typo-cards-details").addClass("typo-cards-details-show");
    $( ".cache-homepage-hide").removeClass("cache-homepage-hide");
  });
});

$(document).ready(function(){
  $(".close-overlay").click(function(){
    $(".typo-cards-details-show").removeClass("typo-cards-details-show");
    $(".cache-homepage").addClass("cache-homepage-hide");
  });
  
});
}

function myFunction() {
  // Get the text field
  var copyText = document.getElementById("myInput");

  // Select the text field
  copyText.select();
  copyText.setSelectionRange(0, 99999); // For mobile devices

   // Copy the text inside the text field
  navigator.clipboard.writeText(copyText.value);

  // Alert the copied text


}

