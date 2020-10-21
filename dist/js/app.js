// mobile burger
$('#mobile-menu').on('show.zf.dropdown', () => {
	$(window).scrollTop(0, 0);
	$('.mobile-menu').css({position: 'fixed'});
	$('body').css({overflow: 'hidden'});
    $('.mobile-menu__burger-open').hide();
    $('.mobile-menu__burger-close').show();
});
$('#mobile-menu').on('hide.zf.dropdown', () => {
	$('.mobile-menu').css({position: ''});
	$('body').css({overflow: ''});
    $('.mobile-menu__burger-open').show();
    $('.mobile-menu__burger-close').hide();
});

// desktop search
$('.js-close-search-desktop').on('click', (e) => {
	e.preventDefault();
	$('#search-desktop').foundation('close');
})
$('#search-desktop').on('show.zf.dropdown', () => {
	$(window).scrollTop(0, 0);
	$('.search-desktop').css({position: 'fixed'});
	$('body').css({overflow: 'hidden'});
});
$('#search-desktop').on('hide.zf.dropdown', () => {
	$('.search-desktop').css({position: ''});
	$('body').css({overflow: ''});
});

if (document.querySelector('.notice') || document.querySelector('.main-news'))
{
	$(document).ready(function() {
	    $(window).on('resize', function() {
	        if ($(window).width() <= 639) {
	            $('.notice').addClass('owl-carousel').owlCarousel({
					items: 1,
					autoWidth: true,
					dots: false
				});
	            $('.news').addClass('owl-carousel').owlCarousel({
					items: 1,
					autoWidth: true,
					dots: false
				});
	        } else {
				$('.notice').trigger('destroy.owl.carousel');
	            $('.notice').removeClass('owl-carousel');
				$('.news').trigger('destroy.owl.carousel');
	            $('.news').removeClass('owl-carousel');
	        }
	    }).trigger('resize');
	});
}

if (document.querySelector('.carousel'))
{
	$('.carousel').owlCarousel({
		items: 1,
		dots: true,
	});
}

if(document.querySelector('.selector'))
{
    let x, i, j, l, ll, selElmnt, a, b, c;
    x = document.getElementsByClassName("custom-select");
    l = x.length;

    for (i = 0; i < l; i++) {
        selElmnt = x[i].getElementsByTagName("select")[0];
        ll = selElmnt.length;
        a = document.createElement("div");
        a.setAttribute("class", "select-selected");
        a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
        x[i].appendChild(a);
        b = document.createElement("div");
        b.setAttribute("class", "select-items select-hide");
        for (j = 1; j < ll; j++) {
            c = document.createElement("div");
            c.innerHTML = selElmnt.options[j].innerHTML;
            c.addEventListener("click", function(e) {
                let y, i, k, s, h, sl, yl;
                s = this.parentNode.parentNode.getElementsByTagName("select")[0];
                sl = s.length;
                h = this.parentNode.previousSibling;
                for (i = 0; i < sl; i++) {
                    if (s.options[i].innerHTML == this.innerHTML) {
                        s.selectedIndex = i;
                        h.innerHTML = this.innerHTML;
                        y = this.parentNode.getElementsByClassName("same-as-selected");
                        yl = y.length;
                        for (k = 0; k < yl; k++) {
                            y[k].removeAttribute("class");
                        }
                        this.setAttribute("class", "same-as-selected");
                        break;
                    }
                }
                h.click();
            });
            b.appendChild(c);
        }
        x[i].appendChild(b);
        a.addEventListener("click", function(e) {
            e.stopPropagation();
            closeAllSelect(this);
            this.nextSibling.classList.toggle("select-hide");
            this.classList.toggle("select-arrow-active");
        });
    }

    let closeAllSelect = elmnt => {
        let x, y, i, xl, yl, arrNo = [];
        x = document.getElementsByClassName("select-items");
        y = document.getElementsByClassName("select-selected");
        xl = x.length;
        yl = y.length;
        for (i = 0; i < yl; i++) {
            if (elmnt == y[i]) {
                arrNo.push(i)
            } else {
                y[i].classList.remove("select-arrow-active");
            }
        }
        for (i = 0; i < xl; i++) {
            if (arrNo.indexOf(i)) {
                x[i].classList.add("select-hide");
            }
        }
    }

    document.addEventListener("click", closeAllSelect);
}

if (document.querySelector('.gallery'))
{
    $(document).ready(function() {

        let sync1 = $("#sync1");
        let sync2 = $("#sync2");
        let slidesPerPage = 4;
        let syncedSecondary = true;

        sync1.owlCarousel({
            items: 1,
            slideSpeed: 2000,
            nav: false,
			center: true,
            autoplay: false,
            dots: false,
            loop: false,
            responsiveRefreshRate: 200,
        }).on('changed.owl.carousel', syncPosition);

        sync2
            .on('initialized.owl.carousel', function() {
                sync2.find(".owl-item").eq(0).addClass("current");
            })
            .owlCarousel({
                items: slidesPerPage,
                dots: false,
                nav: false,
				margin: 8,
                smartSpeed: 200,
                slideSpeed: 500,
                slideBy: slidesPerPage,
                responsiveRefreshRate: 100
            }).on('changed.owl.carousel', syncPosition2);

        function syncPosition(el) {
            let current = el.item.index;

            sync2
                .find(".owl-item")
                .removeClass("current")
                .eq(current)
                .addClass("current");
            let onscreen = sync2.find('.owl-item.active').length - 1;
            let start = sync2.find('.owl-item.active').first().index();
            let end = sync2.find('.owl-item.active').last().index();

            if (current > end) {
                sync2.data('owl.carousel').to(current, 100, true);
            }
            if (current < start) {
                sync2.data('owl.carousel').to(current - onscreen, 100, true);
            }
        }

        function syncPosition2(el) {
            if (syncedSecondary) {
                let number = el.item.index;
                sync1.data('owl.carousel').to(number, 100, true);
            }
        }

        sync2.on("click", ".owl-item", function(e) {
            e.preventDefault();
            let number = $(this).index();
            sync1.data('owl.carousel').to(number, 300, true);
        });
    });
}

if (document.querySelector('.feedback__form'))
{
    let phoneMask = IMask(
        document.getElementById('phone'), {
            mask: '+{7} (000) 000-00-00'
        });
}
