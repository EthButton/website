function update_dash()
{

    if(game.totalclick > 0)
    {
    $('#clicked').html(', '+game.totalclick+' total clicked');

    $('#eth_button').html(game.ethclickprice+' '+'<i class="fab fa-ethereum"></i>');     


    $('#eth_total_pot').html(game.ethpot);
    }

    if(game.your_click > 0 && game.loaded==0)
    {
        $('#personal_stat').html('You have been clicked the Button '+game.your_click+'x times. '+url_generator(account)+reff_data(game.reffered_count,game.reffer_pot));
        game.loaded = 1;
    }


    if(game.time > 0 && game.expiretime > 0)
    {
        $('#pie_button').pietimer('start');

        let distance = game.expiretime-(game.time+window.windowage);


        if(window.windowage<3)
        $('#pie_button').pietimer('update',delay(300,distance));
      //  console.log(distance);

        $('#happen_in').html(countdown(distance));
    }
    else
    {
        $('#pie_button').pietimer('start');
        $('#pie_button').pietimer('pause');
    }

    if(game.over == 1)
    {
        $('#debug').show();

    }


}



$(function(){

$('#pie_button').pietimer({
    seconds: 300,
    height: 200,
    width: 200,
    is_reversed: true
});

});


function delay(fulltime,distance)
{
    return fulltime-distance;
}


function reff_data(count,pot)
{
        if(count > 0)
        {
            let pot_text = "";

            if(pot>=0.0001)
            {
            pot_text = "<br>Total referral share = "+pot+' <i class="fab fa-ethereum"></i>';
            }

        return "<br> You have "+count+" referrals. "+pot_text;
        }
    return "";
}

function url_generator(address)
{
  if(game.referee == "")  
  {
  return '<br> Your referral link: '+window.location.href+'?reff='+address;
  }
  return "";
}

function countdown (distance)
{

  if(distance>0)
  {
        distance = distance*1000; // Fukin unixtime

        // Time calculations for days, hours, minutes and seconds
        var days = Math.floor(distance / (1000 * 60 * 60 * 24));
        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Display the result in the element with id="demo"
        let string = hours + "h "
        + minutes + "m " + seconds + "s ";

        if(days>0)
        {
        let string = 
        + minutes + "min " + seconds + "sec ";
        }

        return string;
  }

}


function update_leaderboard()
{      
       let counter = 30;

       $('#last_clickers').html('');

       let content = "";
       /*
          <tbody id="last_clickers">
                      <tr>
                        <th scope="row">30</th>
                        <td>........</td>
                      </tr>
                    </tbody>
       */

       for (let index = 0; index < game.leaderboard.length; index++)
       {
        number = index+1;  
        content += '<tr><th scope="row">'+number+'<td> '+game.leaderboard[index]+'</td></tr>';
       }  


       $('#last_clickers').html(content);

};



$( document ).ready(function() {

        function update(){

            update_dash();
            update_leaderboard();
        };


    

        setInterval(update, 1000); // Main Loop every 100ms

        setInterval(startTime,1000);

        function startTime() {
            window.windowage = window.windowage+1;
        }     
});