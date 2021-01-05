let count_found = 0;

  $(function() {
    $(document).ready(function(){
      setTimeout(function() {
        $(".loading").fadeOut();
      }, 4000);
    });

    $('.hotspot').on('click', function(){
      let id = $(this).attr('id');
      $('.fiche').slideUp();
      $('.close').addClass('show');
      $('.fiche[data-hotspot="'+id+'"]').slideToggle();
    });

    $('.close').on('click', function(){
      $('.fiche').slideUp();
      $('.close').removeClass('show');
    });



    $('.hotspot').not('.found').one('click', function(){
      count_found++;
      $(this).addClass('found');

      let id = $(this).attr('id');
      $('.menu-item[data-hotspot="'+id+'"]').addClass('found');

      $('#count_found').text(count_found);

      if (count_found == 9){
        $('.popup').show();
      }

    });


    $(document).on('mousemove', function(e) {

      $('.hole').css({
        top: e.pageY,
        left: e.pageX
      })
    });


      var scrollElScroll = document.querySelector(".map .inner");
      var scr = new ScrollBooster({
        viewport: document.querySelector(".map"),
        emulateScroll: true,
        bounce: false, // Pour éviter l'effet élastique
        //friction: 0.2, // Pour régler la friction du déplacement
        onUpdate: function(data) {
          scrollElScroll.style.transform =
            "translate(" + -data.position.x + "px, " + -data.position.y + "px)";
        },
      });


      $(".hotspot").on("click", function(){
        $(this).addClass("trouve")
      })


        $('.count').on('click', function(){
          //menu apparait et disparait
          $('.liste-element').slideToggle();
          });




      scr.setPosition({
        x: 110,
        y: 185
      });

    });
