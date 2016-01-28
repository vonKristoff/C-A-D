(function($) {

  // Module
  function Boss (){

    this.config = {};

    // self invoking constructor
    (function constructor(){
      console.log('constructing');
    }).bind(this)()    

    return this.API()  
  };
  var s = Boss.prototype;

  // return public API
  s.API = function(){
    
    return {
      
      init: function (){
        console.log(this);
      }.bind(this)
    }
  }



  // bind to window as global
  window.App = new Boss();

  // do what you gotta do
  App.init();

})(jQuery);