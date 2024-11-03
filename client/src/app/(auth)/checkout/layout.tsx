// src/app/checkout/layout.tsx
export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen max-w-2xl justify-center">
      <div className="w-full">{children}</div>
    </div>
  );
}
