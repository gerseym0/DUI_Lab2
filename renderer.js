const editor = document.getElementById('editor');

// Отримання тексту при відкритті файлу
window.electronAPI.onFileOpened((content) => {
    editor.value = content;
});

// Очищення для нового файлу
window.electronAPI.onFileNew(() => {
    editor.value = '';
});

// Реакція на команду "Зберегти" з меню
window.electronAPI.onRequestSave(() => {
    const content = editor.value;
    window.electronAPI.saveFile(content);
});