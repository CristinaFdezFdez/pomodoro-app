"use strict";

document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('task-name');
    const timeDisplay = document.getElementById('time');
    const startBtn = document.getElementById('start-btn');
    const pauseBtn = document.getElementById('pause-btn');
    const stopBtn = document.getElementById('stop-btn');
    const nextBtn = document.getElementById('next-btn');
    const resetHistoryBtn = document.getElementById('reset-history-btn');
    const historyList = document.getElementById('history-list');

    let interval;
    let isRunning = false;
    let time = 1500; // 25 minutes
    let taskName = '';
    let history = JSON.parse(localStorage.getItem('pomodoroHistory')) || [];
    let startTime = 0;
    let elapsedTime = 0;

    startBtn.addEventListener('click', () => {
        if (!taskInput.value.trim()) {
            alert('Por favor, introduce el nombre de la tarea.');
            return;
        }
        taskName = taskInput.value;
        startTimer();
    });

    pauseBtn.addEventListener('click', () => {
        if (isRunning) {
            clearInterval(interval);
            isRunning = false;
            pauseBtn.textContent = 'Reanudar';
        } else {
            startTimer();
            pauseBtn.textContent = 'Pausar';
        }
    });

    stopBtn.addEventListener('click', () => {
        clearInterval(interval);
        isRunning = false;
        saveHistory();
        time = 1500; // Reset to 25 minutes
        elapsedTime = 0; // Reset elapsed time
        updateDisplay();
        taskInput.disabled = false;
        startBtn.disabled = false;
        pauseBtn.textContent = 'Pausar';
        pauseBtn.disabled = true;
        stopBtn.disabled = true;
        nextBtn.disabled = false;
    });

    nextBtn.addEventListener('click', () => {
        clearInterval(interval);
        isRunning = false;
        saveHistory();
        time = (time === 1500) ? 1800 : 1500; // Switch to 30 mins or back to 25 mins
        elapsedTime = 0; // Reset elapsed time
        updateDisplay();
        taskInput.disabled = false;
        startBtn.disabled = false;
        pauseBtn.textContent = 'Pausar';
        pauseBtn.disabled = true;
        stopBtn.disabled = true;
        nextBtn.disabled = true;
    });

    resetHistoryBtn.addEventListener('click', () => {
        history = [];
        localStorage.removeItem('pomodoroHistory');
        historyList.innerHTML = '';
    });

    function startTimer() {
        if (!isRunning) {
            taskInput.disabled = true;
            isRunning = true;
            startBtn.disabled = true;
            pauseBtn.disabled = false;
            stopBtn.disabled = false;
            nextBtn.disabled = true;
            startTime = Date.now();
            interval = setInterval(() => {
                const now = Date.now();
                elapsedTime = Math.floor((now - startTime) / 1000);
                time = 1500 - elapsedTime;

                if (time <= 0) {
                    clearInterval(interval);
                    isRunning = false;
                    time = 0;
                    alert('Tiempo terminado!');
                    saveHistory();
                    elapsedTime = 0; // Reset elapsed time
                    time = (time === 1500) ? 1800 : 1500; // Switch to 30 mins or back to 25 mins
                    updateDisplay();
                    taskInput.disabled = false;
                    startBtn.disabled = false;
                    pauseBtn.textContent = 'Pausar';
                    pauseBtn.disabled = true;
                    stopBtn.disabled = false;
                    nextBtn.disabled = false;
                }

                updateDisplay();
            }, 1000);
        }
    }

    function updateDisplay() {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        timeDisplay.textContent = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }

    function saveHistory() {
        if (taskName) {
            const record = {
                date: new Date().toLocaleString(),
                task: taskName,
                duration: 1500 - time + elapsedTime // Duration in seconds
            };
            history.push(record);
            localStorage.setItem('pomodoroHistory', JSON.stringify(history));
            displayHistory();
        }
    }

    function displayHistory() {
        historyList.innerHTML = '';
        history.forEach(record => {
            const listItem = document.createElement('li');
            listItem.textContent = `${record.date} - Tarea: ${record.task} - Duración: ${Math.floor(record.duration / 60)}m ${record.duration % 60}s`;
            historyList.appendChild(listItem);
        });
    }

    displayHistory(); // Load history on page load
});
