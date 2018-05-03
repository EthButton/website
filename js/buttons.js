
// START GAME BUTTON
$(function(){
    $("#eth_button").click(function(event){
        event.preventDefault();
        click_the_button();
    });
});

$(function(){
    $("#debug_gameover").click(function(event){
        event.preventDefault();
        game_over();
    });
});


$(function(){
    $("#debug_devfund").click(function(event){
        event.preventDefault();
        debug_devfund();
    });
});