// src/app/checkout/layout.tsx
export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="checkout-layout">
      <h1>Checkout Process Layout</h1>
      {children}
    </div>
  );
}
