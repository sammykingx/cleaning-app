document.addEventListener("DOMContentLoaded", async () => {
  const animation = document.getElementById("animation");
  const payButton = document.getElementById("card-pay-button");

  const { appId, locationId } = window.SQUARE_CONFIG;

  if (!appId || !locationId) {
    console.error("Square config missing!");
    return;
  }

  const payments = Square.payments(appId, locationId);
  const card = await payments.card();
  await card.attach("#card-container");

  animation.classList.add("hidden");
  payButton.classList.remove("hidden");

  const token =
    document.head.querySelector('meta[name="csrf-token"]')?.content || "";

  document.getElementById("card-pay-button").addEventListener("click", async () => {
    const loadingModal = document.getElementById("loadingModal");
    loadingModal.classList.remove("hidden");
    const result = await card.tokenize(bookingDetails);
    if (result.status === "OK") {
        console.log(`TOKEN: ${JSON.stringify(result, null, 2)}`);
        await fetch("/payments", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": token
          },
          body: JSON.stringify(
            {
              nonce: result.token,
              bookingDetails,
            }),
        });
      } else {
        console.error(result);
      }
  });
});
