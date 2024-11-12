(function() {  
  let chatWindow = document.getElementById('chatWindow'),
      input = document.getElementById('mainInputField'),
      submit = document.getElementById('submitButton'), 
      indicator;

  //PARSE CSV
  let sheetsURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT5piRMxB2vN2YsZE9t0k5XhRPJ-z1LlC5R4Abi7dxHAw-by7xLEVFqHcTGXcZPOArJNlJcFnt3d9sv/pub?gid=0&single=true&output=csv'

  //load data
  function init() {
    Papa.parse(sheetsURL, {
      download: true,
      header: true,
      complete: config
    });
    
  };

  function config(results) {
    data = results.data;
    data.forEach((d, i) => {

    });

    //TESTING API CALL

    //typing indicator (user)
    input.addEventListener('input', userTyping)

    //submit user responses
    let submitEvents = ['click', 'keydown']

    submitEvents.forEach(e => {
      submit.addEventListener(e, getResponse)
    })

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        getResponse();
      }
    })

  };

  function userTyping(){
    if (!indicator) {
      indicator = document.createElement('div')
      indicator.classList.add('chatOutput', 'user', 'typingIndicator')

      for (let i = 0; i < 3; i++){
        let dot = document.createElement('span');
        dot.classList.add('dot');
        indicator.appendChild(dot);
      }
    }

    if (input.value){
      //append indicator bubble on user input
      if(!chatWindow.contains(indicator)){
        chatWindow.appendChild(indicator)
        indicator.classList.add('user')

        chatWindow.scrollTop = chatWindow.scrollHeight;

        submit.querySelector('.submitIcon').setAttribute('style', 'fill: rgb(207, 10, 44)')
      }
    } else {
      //remove indicator bubble if input field is blank
      if (chatWindow.contains(indicator)) {
        chatWindow.removeChild(indicator)
      }

      //reset chat and button styling
      submit.querySelector('.submitIcon').setAttribute('style', 'fill: rgb(143, 143, 143)')
    }
  }

  function getResponse(){
    //USER RESPONSE 
    if (chatWindow.contains(indicator)) {
      chatWindow.removeChild(indicator)
    }

    input.value && (chatWindow.innerHTML += `<div class="chatOutput user">${input.value}</div>`)

    chatWindow.scrollTop = chatWindow.scrollHeight;

    //reset chat input and button styling
    submit.querySelector('.submitIcon').setAttribute('style', 'fill: rgb(143, 143, 143)')

    input.value = '';
    input.placeholder = 'Message Johnny'

    //BOT RESPONSE
  }


  window.addEventListener('load', () => {
    // xtalk.signalIframe();

    init(); 
  })
  
})();