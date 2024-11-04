// src/app/checkout/layout.tsx
export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen max-w-2xl justify-center">
      <div className="w-full max-w-6xl">{children}</div>
    </div>
  );
}
