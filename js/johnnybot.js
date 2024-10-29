(function() {   
    //PARSE CSV
  
    let sheetsURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT5piRMxB2vN2YsZE9t0k5XhRPJ-z1LlC5R4Abi7dxHAw-by7xLEVFqHcTGXcZPOArJNlJcFnt3d9sv/pub?gid=0&single=true&output=csv'
  
    //load data
    function init() {
      Papa.parse(sheetsURL, {
        download: true,
        header: true,
        complete: config
      });
  
      //setTimeout(function(){ xtalk.signalIframe(); }, 3500);
    };
  
    function config(results) {
      data = results.data;
      data.forEach(function(d, i){
  
      });
  
      //INIT STATE
  
    };
  
  
    window.addEventListener('load', function(){
      // xtalk.signalIframe();
  
      init(); 
    })
  
    //JS TESTING
    // let testElement = document.getElementById('hero')

    // testElement.style.backgroundColor = "rgba(0, 0, 0, 0)"
    
  })();