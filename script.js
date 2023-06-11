const chatInput= document.querySelector(".chat-input textarea");
const sendChatBtn= document.querySelector(".chat-input span");
const chatbox= document.querySelector(".chatbox");
const chatbotToggler= document.querySelector(".chatbot-toggler");
const chatbotCloseBtn= document.querySelector(".close-btn1");

let userMessage;
const API_KEY="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";
const inputInitHeight=chatInput.scrollHeight;
const createChatLi= (message,className)=>{
    // creating a chat <li> element with passed message and classname 
    const chatLi=document.createElement("li");
    chatLi.classList.add("chat",className);
    let chatContent=className==="outgoing"? `<p></p>`:`<span class="material-symbols-outlined">smart_toy</span><p></p>`;
    chatLi.innerHTML=chatContent;
    chatLi.querySelector("p").textContent=message; /*this keeps message as message even html tags are sent*/
    return chatLi;



}
const generateResponse = (incomingChatLi)=>{
    const API_URL ="https://api.openai.com/v1/chat/completions";
    const messageElement=incomingChatLi.querySelector("p");
    const requestOptions = {
        method:"POST",
        headers:{
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify
        (
            {
                "model": "gpt-3.5-turbo",
                "messages": [{"role": "user", "content": userMessage}]
            }
              
        )
    }
    // send POST request to API ,get response
    fetch(API_URL,requestOptions).then(res=>res.json()).then(data=>{
        console.log(data);
        messageElement.textContent=data.choices[0].message.content;
    }).catch((error)=>{
        messageElement.classList.add('error');
        messageElement.textContent="Oops! Something went wrong. Please try again" ;
        
        }).finally(()=>chatbox.scrollTo(0,chatbox.scrollHeight));
}

const handleChat=()=>{
    userMessage=chatInput.value.trim();
    if(!userMessage) return;
    chatInput.value=""; /*keeps text area clean after sending message*/
   
    // resetting the textarea height to its original once message is set 
    chatInput.style.height=`${inputInitHeight}px`;
   
     // append user's message to chatbox 
 
     chatbox.appendChild(createChatLi(userMessage, "outgoing"));
 chatbox.scrollTo(0,chatbox.scrollHeight);

 // display "thinking.." message while waiting for response
 setTimeout(()=>{
    const incomingChatLi=createChatLi("Thinking...", "incoming");
    chatbox.appendChild(incomingChatLi); 
    chatbox.scrollTo(0,chatbox.scrollHeight);
    generateResponse(incomingChatLi);
},600 )
}

// adjust the height of theinput text area based on its content
chatInput.addEventListener("input",()=>{
    chatInput.style.height=`${inputInitHeight}px`;
    chatInput.style.height=`${chatInput.scrollHeight}px`;
});



chatInput.addEventListener('keydown',(e)=>{

    // if enter key is pressed w/o shift key and window 
    // width is greater than 800px handle the chat
    if(e.key === "Enter" && !e.shiftKey && window.innerWidth>800){
        e.preventDefault();
        handleChat();
    }
})

chatbotCloseBtn.addEventListener("click", ()=>document.body.classList.remove("show-chatbot")); 

sendChatBtn.addEventListener("click", handleChat);

chatbotToggler.addEventListener("click", ()=>document.body.classList.toggle("show-chatbot"));
