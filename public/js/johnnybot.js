(function() {  
  let chatWindow = document.getElementById('chatWindow'),
    input = document.getElementById('mainInputField'),
    submit = document.getElementById('submitButton'), 
    indicator;

  //greet user after page loads
  function greetUser(){
    let greeting = document.createElement('div')

    greeting.classList.add('chatOutput', 'bot')
    greeting.innerHTML = `Hi there! I'm Johnny Thunderbot – your guide to St. John's University. <br><br>Want to know how to register for class? The best places to eat? Confused about the campus?<br><br>Ask me anything.`

    chatWindow.append(greeting)

    
  }

  window.onload = setTimeout(greetUser, 500);

  //FUNCTIONALITIES 

  //typing indicator (user)
  input.addEventListener('input', userTyping)

  //submit user responses
  let submitEvents = ['click', 'keydown']

  submitEvents.forEach(e => {
    submit.addEventListener(e, getResponse)
  })

  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      getResponse();
    }
  })

  function smoothScroll(elem){
    elem.scrollTo({
      top: elem.scrollHeight,
      behavior: 'smooth'
    })
  }

  function userTyping(){
    //create typing indicator element for user side
    if (!indicator) {
      indicator = document.createElement('div')
      indicator.classList.add('chatOutput', 'user', 'typingIndicator')

      for (let i = 0; i < 3; i++){
        let dot = document.createElement('span');
        dot.classList.add('dot', 'bot');
        indicator.appendChild(dot);
      }
    }

    if (input.value){
      //append indicator bubble on user input
      if(!chatWindow.contains(indicator)){
        chatWindow.appendChild(indicator)

        smoothScroll(chatWindow)

        submit.querySelector('.submitIcon')
          .setAttribute('style', 'fill: rgb(207,10,44); filter: drop-shadow(1px 1px 2px rgba(0, 0, 0, 0.2));')
      }
    } else {
      //remove indicator bubble if input field is blank
      if (chatWindow.contains(indicator)) {
        chatWindow.removeChild(indicator)
      }

      //reset chat and button styling
      submit.querySelector('.submitIcon')
        .setAttribute('style', 'fill: rgb(143,143,143); filter: none;')
        
    }
  }

  async function getResponse(){
    //USER RESPONSE 
    if (chatWindow.contains(indicator)) {
      chatWindow.removeChild(indicator)
    }

    let userMessage = input.value;

    if (userMessage) {
      chatWindow.innerHTML += `<div class="chatOutput user">${userMessage}</div>`
      smoothScroll(chatWindow)

      //reset chat input and button styling
      submit.querySelector('.submitIcon').setAttribute('style', 'fill: rgb(143, 143, 143)')
      input.value = '';
      input.placeholder = 'Message Johnny'
    }

    //bot typing indicator
    let botIndicator = document.createElement('div')
    botIndicator.classList.add('chatOutput', 'bot', 'typingIndicator')

    for (let i = 0; i < 3; i++){
      let dot = document.createElement('span');
      dot.classList.add('dot', 'bot');
      botIndicator.appendChild(dot);
    }

    chatWindow.appendChild(botIndicator);
    smoothScroll(chatWindow)

    //LLM RESPONSE
    try {
      const response = await fetch("http://localhost:8000/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message: userMessage })
      });
  
      if (!response.ok) {
        const errorMessage = await response.text(); 
        throw new Error(`HTTP ${response.status}: ${errorMessage}`);
      }
  
      const data = await response.json();

      if (chatWindow.contains(botIndicator)){ chatWindow.removeChild(botIndicator) }

      chatWindow.innerHTML += `<div class="chatOutput bot">${data.reply}</div>`

      smoothScroll(chatWindow)

    } catch (error) {
      console.error("Fetch error:", error.message);

      chatWindow.innerHTML += `<div class="chatOutput bot">Sorry, Johnny couldn't get this message. Please wait or try again.</div>`

      if (chatWindow.contains(botIndicator)){ chatWindow.removeChild(botIndicator) }
    }
  
  }

  console.log('@ https://github.com/CUS690/johnnybot')

})();
