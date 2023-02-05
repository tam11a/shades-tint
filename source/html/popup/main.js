var color;
const copy = document.getElementById("copy");
const eyeDropper = document.getElementById("eyedropper");
const colortextInput = document.getElementById("colortextInput");
const colorpickerInput = document.getElementById("colorpickerInput");

const copyColor = async (c) => await navigator.clipboard.writeText(c || color);

const setColor = (c) => {
	color = c;
	colortextInput.value = color;
	colorpickerInput.value = color;
};

eyeDropper.addEventListener("click", async () => {
	let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

	chrome.scripting.executeScript(
		{
			target: { tabId: tab.id },
			function: pickerFunction,
		},
		async (results) => {
			const [result] = results;
			if (!result.result) return;
			setColor(result.result.sRGBHex);
			copyColor();
		}
	);
});

const pickerFunction = async () => {
	try {
		return await new EyeDropper().open();
	} catch (err) {
		console.log(err);
	}
};

copy.addEventListener("click", () => copyColor());
colortextInput.addEventListener("change", (e) => setColor(e.target.value));
colorpickerInput.addEventListener("change", (e) => setColor(e.target.value));

const init = () => {
	setColor("#ffffff");
};

init();
