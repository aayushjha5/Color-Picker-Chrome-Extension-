const btn = document.querySelector('.changeColorBtn');
const colorGrid = document.querySelector('.colorGrid');
const colorValue = document.querySelector('.colorValue');

//popup process
btn.addEventListener('click', async () => {
    chrome.storage.sync.get('color', (color) => {
        console.log('color', color);
    });
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: pickColor,
    }, async (injectionResults) => {
        const [data] = injectionResults;
        if (data.result) {
            const color = data.result.sRGBHex;
            colorGrid.style.backgroundColor = color;
            colorValue.innerText = color;
            //using navigator api of browser , copy the code to clipboard
            try {
                await navigator.clipboard.writeText(color);
            } catch (err) {
                console.error(err);
            }
        }
    });
});

//dom process
async function pickColor() {
    try {
        //activate picker
        const eyeDropper = new EyeDropper();
        return await eyeDropper.open();
    } catch (err) {
        console.error(err);
    }
}