var contador = 1;
document.addEventListener('DOMContentLoaded', function(){ 
    document.getElementById('menu1').onclick=function(){
		// $('nav').toggle(); 
 		var animar = document.getElementById('menup');
 		
 		
		if(contador == 1){
			animar.style.left= '0';
			contador = 0;
		} else {
			animar.style.left= '-100%';
			contador = 1;
			
		}
 
	};
}, false);

/*
$(document).ready(main);
 
var contador = 1;
 
function main(){
	$('.menu1').click(function(){
		// $('nav').toggle(); 
 
		if(contador == 1){
			$('.menup').animate({
				left: '0px'
			});
			contador = 0;
		} else {
			contador = 1;
			$('.menup').animate({
				left: '-100%'
			});
		}
 
	});
 
};

*/