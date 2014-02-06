(function ($) {

    UserAction = (function(){

        function UserAction(div) {
            var self = this; 
            self.targetElm = div;
            self.mouse = { distance : 100, overBut : false, overAd : false, clicked : false};
            self.hundredMills = [];
            this.init();
        }

        UserAction.prototype.init = function () {
            var self = this;
            self.getDistance();
            self.getMouseOvers();
            self.getClicked();
            self.setUserSession();
        };
        UserAction.prototype.getDistance = function(){
            var self = this, target = self.targetElm, mX, mY, output = $('.output'); 
            var calculateDistance = function (elem, mouseX, mouseY) {
                return Math.floor(Math.sqrt(Math.pow(mouseX - (elem.offset().left+(elem.width()/2)), 2) + Math.pow(mouseY - (elem.offset().top+(elem.height()/2)), 2)));
            };
         
            $(document).mousemove(function(e) {  
                mX = e.pageX;
                mY = e.pageY;
                self.mouse.distance = calculateDistance(target, mX, mY);      
            });
        };

        UserAction.prototype.getMouseOvers = function(){
            var self = this, adTarget = $('.ad-270x225'), buttonTarget = $('.ad-270x225 button');

            adTarget.mouseenter(function(){
                self.mouse.overAd = true;

                buttonTarget.mouseenter(function(){
                    self.mouse.overBut = true;
                });

                buttonTarget.mouseleave(function(){
                    self.mouse.overBut= false;
                }); 
            });

            adTarget.mouseleave(function(){
                self.mouse.overAd = false;
            }); 

        };             
        UserAction.prototype.getClicked = function(){
            var self = this, target = self.targetElm;
            target.click(function(){
                self.mouse.clicked = true; 
            });
        };      
        UserAction.prototype.setUserSession = function(){
            var self = this, millisecs = 0, seconds = 0;
            var si = setInterval(function(){
         
                self.millisecData();
                self.mouse.clicked = false;
                if(millisecs%10 === 0){seconds++;}
                millisecs++;
                if(seconds > 15){
                    clearInterval(si);
                    console.log(self.hundredMills);
                    self.displayData();
                }
            },100);
        };
        UserAction.prototype.millisecData = function(){
            var self = this;
            var dataObj = {
                distance : self.mouse.distance,
                overAd : self.mouse.overAd,
                overBut : self.mouse.overBut,
                clicked : self.mouse.clicked
            };
            self.hundredMills.push(dataObj);
           // console.log(self.mouse.distance,"over button: ",self.mouse.overBut,"over ad: ",self.mouse.overAd,"button clicked: ",self.mouse.clicked);  
        };
        UserAction.prototype.displayData = function(){
            var self = this;
            var outputHTML = [];

            var cssStyles = ''+
            '<style>'+
            '.results{position:absolute; bottom:0;}'+
            '.results ul{list-style-type: none;width:1050px;height:50px;}'+
            '.results ul.actions li{height:15px; width:5px;border: 1px solid #000}'+
            '.results ul.heat li{height:20px; width:7px;}'+
            '.results ul.speed li{height:100px; width:7px;}'+
            '.results li {float:left; width:5px; height:20px;font-size: 8px;}'+
            '.results li.bar1{background-image: url("img/bar1.jpg");}'+
            '.results li.bar2{background-image: url("img/bar2.jpg");}'+
            '.results li.bar3{background-image: url("img/bar3.jpg");}'+
            '.results li.bar4{background-image: url("img/bar4.jpg");}'+
            '.results li.bar5{background-image: url("img/bar5.jpg");}'+
            '.results li.bar6{background-image: url("img/bar6.jpg");}'+
            '.results li.bar7{background-image: url("img/bar7.jpg");}'+
            '.results li.bar8{background-image: url("img/bar8.jpg");}'+
            '.results li.bar9{background-image: url("img/bar9.jpg");}'+
            '.results li.bar10{background-image: url("img/bar10.jpg");}'+
            '.results li.overAd{background-image: url("img/overAd.jpg");}'+
            '.results li.overBut{background-image: url("img/overButton.jpg");}'+
            '.results li.clicked{background-color:red;}'+
            '</style>';

            var getHeatColor = function(val){
                var n = 1000, r = 255, g = 0, b = 0, pos = {r2 : 71, g2 : 226, b2 : 64},
                neg = {r2 : 207, g2 : 11, b2 : 28}, cObj = {};
                val = parseInt(val);

                cObj = (parseInt(val) > 0)? pos : neg; 

                pos = parseInt((Math.round((Math.abs(val)/7)*100)).toFixed(0));
                var red = parseInt((r + (( pos * (cObj.r2 - r)) / (n-1))).toFixed(0));
                var green = parseInt((g + (( pos * (cObj.g2 - g)) / (n-1))).toFixed(0));
                var blue = parseInt((b + (( pos * (cObj.b2 - b)) / (n-1))).toFixed(0));
                
                return 'rgb('+red+','+green+','+blue+')';
            };

            //Actions:
           outputHTML.push('<div class="results"><p>Actions:</p><ul class="actions">');
            for(var i = 0; i < self.hundredMills.length -1; i++){
                var s = self.hundredMills[i], aClass= "";
                console.log(s);
                if(s.overBut === true){
                    aClass = "overBut";
                }else if(s.overAd === true){
                    aClass = "overAd";
                }
                if(s.clicked === true){
                    aClass = "clicked";
                }

                outputHTML.push('<li class="'+aClass+'"></li>');
            }

            //Heat:
            outputHTML.push('</ul><p>Distance from button:</p><ul class="heat">');
            for(var j = 0; j < self.hundredMills.length -1; j++){ 
                outputHTML.push('<li style="background-color:'+getHeatColor(self.hundredMills[j].distance)+'"></li>');
            }

            //Speed:
            outputHTML.push('</ul><ul class="speed"><p>Speed of mouse</p>');
            for(var k = 0; k < self.hundredMills.length -1; k++){
                var did, differenceInDistance = self.hundredMills[k+1].distance - self.hundredMills[k].distance;
                did = Math.abs(differenceInDistance);

                if(did < 5){
                    did = "bar1";
                }else if(did < 10){
                    did = "bar2";
                }else if(did < 20){
                    did = "bar3";
                }else if(did < 30){
                    did = "bar4";
                }else if(did < 40){
                    did = "bar5";
                }else if(did < 50){
                    did = "bar6";
                }else if(did < 70){
                    did = "bar7";
                }else if(did < 120){
                    did = "bar8";
                }else if(did < 150){
                    did = "bar9";
                }else{
                     did = "bar10";
                }

                outputHTML.push('<li class="'+did+'"></li>');
            }            
            outputHTML.push('</ul></div>');
            $('body').append(cssStyles);
            $('body').append(outputHTML.join(""));

        };

        return UserAction;
    })();

    $(document).ready(function(){
       var ua = new UserAction($('.ad-270x225 button'));
     });  

}(jQuery));