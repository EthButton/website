window.addEventListener('load', function() {
            if (typeof web3 !== 'undefined') 
            {
            startApp(web3);
            } 
            else 
            { 
              $('#metamask_alert_message').html(gametext.error[0]);
              $('#metamask_alert').modal('show');
            }
            });
   // WEB3 INIT DONE!
  
      const contract_address = "0x26268d38aeac890caa5b24f4dbea540b09ad9841";
      var account =  web3.eth.accounts[0];

      game = [];
      game.default_gas_price = web3.toHex(5000000000);
      game.time = 0;
      game.expiretime = 0;
      game.price = 0;
      game.ethbalance = 0;

      game.referee = referre_manager();

      window.windowage = 0;
      game.ethpot = 0;
      game.ethclickprice = 0;
      game.your_click = 0;
      game.your_time = 0;
      game.reffered_count = 0;
      game.reffer_pot = 0;
      game.loaded = 0;
      game.leaderboard = [];
      game.over = 0;
      

      function referre_manager()
      {
        let refferal =  getParameterByName('reff');

        if(refferal)
        {
          Cookies.remove("referral_cookie", { path: '/' });
          Cookies.set("referral_cookie", refferal, { expires: 7, path: '/' });
          return refferal;
        }

        if(Cookies.get('referral_cookie'))
        {
          return Cookies.get('referral_cookie');
        }


      }      




      function startApp(web3) 
      {
         web3 = new Web3(web3.currentProvider);

          contract_init(); // GAME LOAD!
      }    

      function contract_init()
      {

        if(typeof web3.eth.accounts[0]  != 'undefined')
        {
          $('#user_address').html(web3.eth.accounts[0]);

          game.user_address = web3.eth.accounts[0];

          // CALLBACK IN GAME.JS!!!!
          ethbutton_contract = web3.eth.contract(abi).at(contract_address);

          ethbutton_contract.GetTotalPlayers.call({},function(err,ress)
            {
              if(!err)
                  {
                    game.totalplayer = ress;
                    console.log("Total Player: "+ress); 
                  } 
            });  

            ethbutton_contract.GetTotalClicks.call({},function(err,ress)
            {
              if(!err)
                  {
                    game.totalclick = ress.toNumber();
                    console.log("Total Click: "+ress); 
                  } 
            });

            ethbutton_contract.GetTotalPot.call({},function(err,ress)
            {
              if(!err)
                  {
                    game.totalpot = ress.toNumber();
                    game.ethpot = web3.fromWei(game.totalpot,'ether');
                    console.log("Total Pot: "+game.ethpot); 
                    
                  } 
            });

            ethbutton_contract.GetExpireTime.call({},function(err,ress)
            {
              if(!err)
                  {
                    game.expiretime = ress.toNumber();
                    console.log("Expire time: "+ress); 
                  } 
            });

            ethbutton_contract.GetClickPrice.call({},function(err,ress)
            {
              if(!err)
                  {
                    game.clickprice = ress;
                    game.ethclickprice = web3.fromWei(ress,'ether');
                    console.log("Click Price: "+ress); 
                  } 
            });


            ethbutton_contract.GetPlayerDataAt.call(account,{},function(err,ress)
            {
              if(!err)
                  {
                    game.your_click = ress[0].toNumber();
                    game.your_time = ress[1].toNumber();
                    game.reffered_count = ress[2].toNumber();
                    game.reffer_pot = web3.fromWei(ress[3].toNumber(),'ether'); 
                    console.log(game.reffer_pot,game.reffered_count);
                  } 
            });


            ethbutton_contract.GetWinners.call({},function(err,ress)
            {
              if(!err)
                  {
                    for (let index = 0; index < ress.length; index++) {
                      game.leaderboard[index] = ress[index].toString();
                      console.log('Winnerdata - Index: '+index+" Value: "+ress[index].toString());
                      }  
                  } 
            });

            /*
            ethbutton_contract.GetWinnerAt.call(0,{},function(err,ress)
            {
              if(!err)
                  {
                      
                  } 
            });
            */

            /*
            GetWinnerAt(uint256 idx) external view returns (address _addr)
            GetWinners() external view returns (address[CLICKERS_SIZE] _addr)

            DistributeButtonIncome() external a kiosztó gomb, amikor lejár az egész(edited)
            WithdrawDevFunds() external, a devfund kikérő

            */


          // GET ETH BALANCE OF USER
          web3.eth.getBalance(game.user_address,function(err,ress){
           if(!err)
           {
             game.ethbalance = web3.fromWei(ress,'ether'); ;
             console.log("ETH balance: "+game.ethbalance+" Ether"); 
           } 
          });


          // WHY IT IS SO UGLY JS WHY?!
         (async ()=> { await web3.eth.getBlockNumber(
           function(err,ress)
           {
            web3.eth.getBlock(ress,function(err,ress){

              if(!ress)
              {
                setTimeout(function () {contract_init()}, 2000);
              }
              else
              {
              game.time = ress.timestamp;
              }

            });
           }
         ) })();

        }
        else // No Metamask Address Found!
        {
          $('#metamask_alert_message').html(gametext.error[1]);
          $('#metamask_alert').modal('show');
        }  
      }


      function click_the_button()
      {

        if(typeof web3.eth.accounts[0]  != 'undefined')
        {

          ethbutton_contract = web3.eth.contract(abi).at(contract_address);

          if( parseInt(game.referee) == parseInt(account))
          {
            game.referee = "0x0000000000000000000000000000000000000000";
          }

          console.log("Referral: "+game.referee);

          ethbutton_contract.ButtonClicked.sendTransaction(game.referee,{from:account,value: game.clickprice,gasPrice: game.default_gas_price},function(err,ress)
          {

            $('#pie_button').pietimer('pause');
            waitForReceipt(ress, function (receipt) 
            {
              console.log('Force!');
              contract_init();
            });  
          }
        );


        }
        else // No Metamask Address Found!
        {
          $('#metamask_alert_message').html(gametext.error[1]);
          $('#metamask_alert').modal('show');
        }  
      }


      function game_over(){

        if(typeof web3.eth.accounts[0]  != 'undefined')
        {

          ethbutton_contract = web3.eth.contract(abi).at(contract_address);

          ethbutton_contract.DistributeButtonIncome.sendTransaction({from:account,gasPrice: game.default_gas_price},function(err,ress)
          {
            waitForReceipt(ress, function (receipt) 
            {
              console.log('Force!');
              contract_init();
            });  
          }
        );


        }
        else // No Metamask Address Found!
        {
          $('#metamask_alert_message').html(gametext.error[1]);
          $('#metamask_alert').modal('show');
        }  

      }

       function GetPlayerAt(id)
       {

         ethbutton_contract.GetPlayerAt.call(id, {from:account},function(err,ress)
           {
             if(!err)
             {
                 return ress.toString();

             } 
             else
             {
                 console.log(err);
             }
           });
 
       }

    
      function debug_devfund()
      {
        if(typeof web3.eth.accounts[0]  != 'undefined')
        {

          ethbutton_contract = web3.eth.contract(abi).at(contract_address);

          ethbutton_contract.WithdrawDevFunds.sendTransaction({from:account,gasPrice: game.default_gas_price},callback);
        }
        else // No Metamask Address Found!
        {
          $('#metamask_alert_message').html(gametext.error[1]);
          $('#metamask_alert').modal('show');
        }  
      }
  



function callback (error, result)
{
        if(!error)
        {
          console.log(result);
        } 
        else
        {
            console.log(error);
        }
};


function waitForReceipt(hash, callback) {
  web3.eth.getTransactionReceipt(hash, function (err, receipt) {
    if (err) {
      error(err);
    }

    if (receipt !== null) {
      // Transaction went through
      if (callback) {
        callback(receipt);
      }
    } else {
      // Try again in 1 second
      window.setTimeout(function () {
        waitForReceipt(hash, callback);
      }, 1000);
    }
  });
}

function toETH(number)
{
  return web3.fromWei(number,'ether');
}

function getParameterByName(name) {
  name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
  var regexS = "[\\?&]" + name + "=([^&#]*)";
  var regex = new RegExp(regexS);
  var results = regex.exec(window.location.href);
  if (results === null) {
      return "";
  } else {
      return decodeURIComponent(results[1].replace(/\+/g, " "));
  }
}