const buttons = document.querySelectorAll("[data-endpoint]");
const status = document.getElementById("status");
const result = document.getElementById("result");
const resultTitle = document.getElementById("resultTitle");
const resultText = document.getElementById("resultText");

const titles = {
  joke: "Here's a Joke 😂",
  motivation: "Your Motivation 💪",
  "tip-of-the-day": "Tip of the Day 💡"
};

const responseKeys = {
  joke: "joke",
  motivation: "motivation",
  "tip-of-the-day": "tip"
};

buttons.forEach((button) => {
  button.addEventListener("click", async () => {
    const endpoint = button.dataset.endpoint;

    buttons.forEach((item) => {
      item.disabled = true;
    });

    status.textContent = "Generating your response...";
    result.hidden = true;

    try {
      const response = await fetch(`/${endpoint}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Request failed.");
      }

      const content = data[responseKeys[endpoint]];

      resultTitle.textContent = titles[endpoint];
      resultText.textContent = content;
      result.hidden = false;
      status.textContent = "Your response is ready!";
    } catch (error) {
      status.textContent =
        `${error.message} Please try again.`;
    } finally {
      buttons.forEach((item) => {
        item.disabled = false;
      });
    }
  });
});
