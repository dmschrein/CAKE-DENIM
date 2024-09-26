import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  {
    /* Children renders what is in the page.tsx */
  }
  return (
    <div className="pt-10">
      <main className="h-full">{children}</main>
    </div>
  );
};

export default layout;
