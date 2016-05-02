$(function () {

	var janela = $(window);
  var $bgHorizontal = $("#bg_horizontal");
  var $bgVertical = $("#bg_vertical");
	    			    		
	function resizeBg() {
		$bgHorizontal.removeClass("width100").removeClass("height100");
		$bgVertical.removeClass("width100").removeClass("height100");

		var janelaHorizontal = true;

		var larguraJanela = janela.width();
		var alturaJanela = janela.height();

		if (alturaJanela > larguraJanela) {
			janelaHorizontal = false;
		}

		var razaoJanela, razaoImagem;

		if (janelaHorizontal) {
			razaoJanela = larguraJanela / alturaJanela;
			razaoImagem = $bgHorizontal.width() / $bgHorizontal.height();

			if (razaoImagem >= razaoJanela) {
				$bgHorizontal.addClass("height100");
			} 
			else {
				$bgHorizontal.addClass("width100");
			}
			$bgHorizontal.show();
			$bgVertical.hide();
		}
		else {
			razaoJanela =  alturaJanela / larguraJanela;
			razaoImagem = $bgVertical.height() / $bgVertical.width();

			if (razaoImagem >= razaoJanela) {
				$bgVertical.addClass("width100");
			} 
			else {
				$bgVertical.addClass("height100");
			}
			$bgVertical.show();
			$bgHorizontal.hide();
		}
	}
	                   			
	janela.resize(resizeBg).trigger("resize");

	var $menu, intervaloSubtrairSecao;
	var jaFixouDentroDoWrapperInicial = false;
	var jaFixouAbaixoDoWrapperInicial = false;

	function espiarScroll(forcarFixar) {
		if (forcarFixar) {
			jaFixouDentroDoWrapperInicial = false;
			jaFixouAbaixoDoWrapperInicial = false;
		}

		if ($('.container-menu-superior').is(":visible")) {
			$menu = $('.container-menu-superior');
			intervaloSubtrairSecao = $('.menu-superior').outerHeight();
		}
		else {
			$menu = $('.container-menu-superior-mobile');
			intervaloSubtrairSecao = $('.menu-superior-mobile').outerHeight();
		}

		var posicaoAtual = $(window).scrollTop();

		var finalWrapperInicial = $('.wrapper-inicial').offset().top + $('.wrapper-inicial').outerHeight();

		if (posicaoAtual < finalWrapperInicial) {
			// Dentro do wrapper inicial

			if (!jaFixouDentroDoWrapperInicial) {
				$('.container-menu-superior').removeClass('fixed');
				$('.container-menu-superior-mobile').removeClass('fixed');
				$(".link_topo").removeClass("ativo");
				$(".conteudo").css("margin-top", "0");	

				jaFixouDentroDoWrapperInicial = true;
				jaFixouAbaixoDoWrapperInicial = false;
			}
		}
		else {
			// Abaixo do wrapper inicial

			if (!jaFixouAbaixoDoWrapperInicial) {

				$menu.addClass('fixed');
				$(".conteudo").css("margin-top", $menu.outerHeight() + "px");

				jaFixouDentroDoWrapperInicial = false;
				jaFixouAbaixoDoWrapperInicial = true;
			}

			var topoSecao;
			var fimSecao;
			var idSecao;

			$('.secao').each(function() {
				topoSecao = Math.ceil($(this).offset().top - intervaloSubtrairSecao);
				fimSecao = Math.floor($(this).offset().top - intervaloSubtrairSecao + $(this).outerHeight());

				if (posicaoAtual >= topoSecao && posicaoAtual < fimSecao) {
					idSecao = $(this).attr('id');

					$(".link_topo").removeClass("ativo");
					$(".link_topo[data-link=" + idSecao + "]").addClass("ativo");
					return false;
				}
			});

		}
	}

	janela.scroll(function () {espiarScroll(false)});
	janela.resize(function () {espiarScroll(true)});
	janela.trigger("scroll");

	window.addEventListener("orientationchange", function () {espiarScroll(true)});

	$(".link_navegacao").on("click", function (evento) {
		evento.preventDefault();

		$("html, body").animate(
			{
        scrollTop: Math.ceil($("#" + $(this).data('link')).offset().top - intervaloSubtrairSecao)
      }, 
      300
    );
	});

	$(".mandar_pro_topo").on("click", function (evento) {
		evento.preventDefault();

		$("html, body").animate(
			{
        scrollTop: $("body").offset().top
      }, 
      300
    );
	});

	// Desabilitar o scroll quando tiver o colorbox aberto
	$(document).bind('cbox_open', function() {
	    $('html').css({ overflow: 'hidden' });
	}).bind('cbox_closed', function() {
	    $('html').css({ overflow: '' });
	});

	$('.prints').colorbox({
		rel: 'prints', 
		transition: 'elastic', 
		scrolling: false, 
		maxWidth: "100%"
	});

});
