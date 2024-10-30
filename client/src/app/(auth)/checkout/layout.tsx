// src/app/checkout/layout.tsx
export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen justify-center bg-gray-100 p-10">
      <div className="w-full">{children}</div>
    </div>
  );
}
