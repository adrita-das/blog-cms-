import './tailwind.css'

//type indicator in text

const textElement = document.getElementById('typing-text');
const text = 'Technology, Startup, LifeStyle';

let index = 0;
const speed = 50;
const pauseTime = 2000;
  
function typeWriter() {
  if(index < text.length){

    textElement.textContent +=text.charAt(index);
    index++;
    setTimeout(typeWriter, speed);
  }

  else{
    setTimeout(()=>{
      textElement.textContent = ''
      index=0;
      typeWriter();
    },
  pauseTime);
  }
}

typeWriter();


