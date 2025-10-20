document.addEventListener("DOMContentLoaded", async () => {
  const payButton = document.getElementById("card-pay-button");

  if (!window.SQUARE_CONFIG) {
    showToast(
      "Payment system is not initialized. Please contact kleenspotless.com support team to resolve the issue.",
      "error",
      "Payment Setup Error"
    );
    console.error("MISSING SQUARE MERCHANT CREDENTIALS");
    return;
  }

  const { appId, locationId } = window.SQUARE_CONFIG;

  if (!appId || !locationId) {
    showToast(
      "Please contact kleenspotless.com support team to resolve this issue.",
      "error",
      "Payment Configuration Error"
    );
    console.error("EMPTY SQUARE MERCHANT CREDENTIALS");
    return;
  }

  const payments = Square.payments(appId, locationId);
  const card = await payments.card();
  await card.attach("#card-container");

  payButton.classList.remove("hidden");

  const token =
    document.head.querySelector('meta[name="csrf-token"]')?.content || "";

  document
    .getElementById("card-pay-button")
    .addEventListener("click", async () => {
      const buttonText = document.getElementById("button-text");
      const processingSpinner = document.getElementById("loading-spinner");
      const paymentModal = document.getElementById("paymentComplete");

      buttonText.classList.add("hidden");
      processingSpinner.classList.remove("hidden");

      const result = await card.tokenize(bookingDetails);

      if (result.status === "OK") {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

          const st_time = performance.now();
          const response = await fetch("/payments", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-CSRFToken": token,
            },
            body: JSON.stringify({
              nonce: result.token,
              bookingDetails,
            }),
            signal: controller.signal,
          });

          clearTimeout(timeoutId);

          const data = await response.json();

          processingSpinner.classList.add("hidden");
          buttonText.classList.remove("hidden");

          const ed_time = performance.now();
          // console.log(`RESPONSE TOOK: ${ed_time - st_time}`);

          if (response.ok) {
            showToast(data.msg, data.type, data.title);
            if (data.status === "completed") {
              buttonText.textContent = "PAID";
              setTimeout(() => {
                location.href = data.receipt_url;
              }, 2000);
            }
          } else {
            showToast(data.msg, data.type, data.title);
            console.error(`ERROR => Server Response: ${data.msg}`);
          }
        } catch (err) {
          processingSpinner.classList.add("hidden");
          buttonText.classList.remove("hidden");

          if (err.name === "AbortError") {
            showToast(
              "Your Square payment is in process. Confirmation will be emailed shortly.",
              "info",
              "Payment In-Progress"
            );
          } else {
            console.error("Unexpected error:", err);
            showToast(
              "An unexpected error occurred. Please try again.",
              "error",
              "Square Payment"
            );
          }
        }
      } else {
        buttonText.classList.remove("hidden");
        processingSpinner.classList.add("hidden");
        console.error(JSON.stringify(result));
      }
    });
});
