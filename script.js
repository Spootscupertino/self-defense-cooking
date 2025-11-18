document.addEventListener('DOMContentLoaded', () => {
  const quotes = [
    'if everything goes perfect we will barely make it'
    // Additional quotes can be added here
  ];
  const quoteElem = document.getElementById('quote');
  let index = 0;

  function updateQuote() {
    if (!quoteElem) return;
    quoteElem.textContent = quotes[index];
    index = (index + 1) % quotes.length;
  }

  // Show the first quote immediately
  updateQuote();
  // Rotate quotes every 5 seconds
  setInterval(updateQuote, 5000);
});
