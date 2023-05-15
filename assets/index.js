document.addEventListener('DOMContentLoaded', () => {
    const nextBtn = document.querySelector('.next');
    const patients = document.querySelectorAll('.patients');
    const socket = new WebSocket('ws://localhost:8080/');
    socket.addEventListener('open', () => {
      console.log('WebSocket connection established');
    });
    const submitBtn = document.querySelector('button[type=submit]');
    let currentIndex = localStorage.getItem('currentIndex') || 0;
    patients[currentIndex].classList.add('highlight');
    nextBtn.addEventListener('click', () => {
      if (patients.length !== 0 && currentIndex < patients.length - 1) {
        const currentPatient = patients[currentIndex];
        currentPatient.classList.remove('highlight');
        currentIndex++;
        patients[currentIndex].classList.add('highlight');
        localStorage.setItem('currentIndex', currentIndex);
        const msg = patients[currentIndex].cells[3].innerHTML;
        socket.send(msg);
      }
    });
  });
  