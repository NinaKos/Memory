/*
http://www.panco.si/memory/tutorial/

Pred vsako spremenljivko daš var v JavaScript
V nasem primeru imamo kompleksen tip variable, vse skupaj zapakiramo v eno funkcijo
Spodnji del kode je prilozen z namenom, da se koda res izvede (vidimo index.html na browserju), ko jo pozenemo
*/

var Memory = (function () {
	var r = {
		images: [
			'http://www.panco.si/memory/editor/red-plane.png',
			'http://www.panco.si/memory/editor/blue-plane.png',
			'http://www.panco.si/memory/editor/red-tank.png',
			'http://www.panco.si/memory/editor/blue-tank.png'
		], 

		colors: ['#99b433', '#1e7145', '#ff0097', '#9f00a7', '#7e3878', '#603cba', '#1d1d1d', '#00aba9', '#eff4ff', '#2d89ef', '#2b5797', '#ffc40d', '#e3a21a', '#da532c', '#ee1111', '#b91d47'],

		/* Premesamo karte, spodnja koda je z stackoverflowa */
		shuffle: function (array) { // http://stackoverflow.com/a/6274398
			var counter = array.length,
				temp = null,
				index = 0;

			// While there are elements in the array
			while (counter > 0) {
				// Pick a random index
				index = Math.floor(Math.random() * counter);

				// Decrease counter by 1
				counter -= 1;

				// And swap the last element with it
				temp = array[counter];
				array[counter] = array[index];
				array[index] = temp;
			}
			return array;
		},

		/* 
		Nujno vejica pred funkcijo draw!! 

		Spodnji game imamo v id v index.html
		V JavaScript je bolje uporabljati $.each namesto for zanke

		css selektorji - oznake s katerimi izberemo del html-ja in mu povemo kaksne lastnosti naj ima
		Pri jQueryju isto uporabljamo . za class in # za id 

		V div moremo dati img element
		append vzame iz div game in mu doda slikice, ki jih potem vidimo na browserju

		$ je za framework jquery od JavaScript, dodamo $ pred objekt za katerega hocemo da se na njem uporabi jquery
		ukaz html jquery objekt prevede v html, ki ga potem vidimo na browserju
		*/

		draw: function () {
			var game = $('#game'),
			shuffledPairs = [],
			shuffledColors = r.shuffle(r.colors);

			$.each(r.images, function (i, imageUrl) {
				var elm = '<div class="memory-element" data-url="' + imageUrl + '"><img width="150" height="150" src="' + imageUrl + '" alt="Am I the correct one?" /></div>';

				shuffledPairs.push(elm);
				shuffledPairs.push(elm);
			});

			$.each(r.shuffle(shuffledPairs), function (i, imageElm) {
				imageElm = $(imageElm);
				imageElm.css('background-color', shuffledColors[i]);
				game.append(imageElm);
			});

			/*
			game.append(elm);
			game.append($(elm).html()); Slikice so blizje druga drugi, vse da v en div 
			*/

		},

		/* 
		Klikanje slikic
		Vsakic, ko kliknes na neko slikico, si bo on zapomnil na katero smo ze kliknili
		Obarva zeleno, ce sta url-ja od slikic enaka, ce nista enaka obarvaj rdece
		Ce se obarva rdece, pocaka 500 mili sekund in potem zbrise rdec okvir
		*/
		handleResolving: function () {
			$('#game').on('click', '.memory-element:not(.solved)', function () {
				var elm = $(this),
					activatedElms = [],
					pair = [];

				elm.addClass('activated');

				activatedElms = $('.activated');

				if (activatedElms.length === 1) {
					// For the time being, do nothing
				} else if (activatedElms.length > 1) {
					r.resolvePair(activatedElms);
				}

				/* Pojavi se okence s spodnjim besedilom in lahko kliknes OK za novo igro */
				if ($('.solved').length === $('.memory-element').length) {
					if (confirm('You win! Click OK to play another game.')) {
						$('.memory-element').remove();
						r.draw();
					}
				}
			});		
		},

		/* Kliknes na dve enaki in dobis zelen okvir okrog slicic (prej je siv okvir), rdec okvir dobis, ce se zmotis */
		resolvePair: function (activatedElms) {
			var pair = [];

			activatedElms.each(function (i, elm) {
				elm = $(elm);

				pair[i] = elm.data('url');
			});

			if (pair[0] === pair[1]) {
				activatedElms.addClass('solved');
				activatedElms.removeClass('activated');
			} else {
				activatedElms.addClass('failed');
				setTimeout(function () {
					activatedElms.removeClass('failed');
					activatedElms.removeClass('activated');
				}, 500);
			}
		}	

	}

	u = {
		initialize: function () {
			r.draw(); /* Poklicemo naso funkcijo, pokazejo se slikice v browserju */
			r.handleResolving();
		}
	};
	
	return u;
}());

$(function () {
	Memory.initialize();
});
