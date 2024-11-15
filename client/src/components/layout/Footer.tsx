import React from "react";

const Footer = () => {
  return (
    <footer className="border-t border-gray-300 bg-white py-20 text-black">
      {/* Upper section with icons */}
      <ul className="container mx-auto mb-20 grid gap-6 text-center md:grid-cols-4">
        <div>
          <div className="mb-2 flex justify-center">
            {/* Icon for free shipping */}
          </div>
          <h3 className="font-bold">Free shipping</h3>
          <p className="text-sm text-gray-600">
            Free returns on qualifying orders
          </p>
        </div>
        <div>
          <div className="mb-2 flex justify-center">
            {/* Icon for stores */}
          </div>
          <h3 className="font-bold">Ref stores</h3>
          <p className="text-sm text-gray-600">We&apos;re all over the place</p>
        </div>
        <div>
          <div className="mb-2 flex justify-center">
            {/* Icon for climate action */}
          </div>
          <h3 className="font-bold">We&apos;re committed to climate action</h3>
          <p className="text-sm text-gray-600">And we have big plans</p>
        </div>
        <div>
          <div className="mb-2 flex justify-center">
            {/* Icon for customer love */}
          </div>
          <h3 className="font-bold">Customer love</h3>
          <p className="text-sm text-gray-600">We got you via email or text</p>
        </div>
      </ul>
      {/* Bottom section to manage the links and newsletter sign up */}
      <div className="grid md:grid-cols-2">
        {/* Left section with navigation and social links */}
        <div className="container mx-auto mb-10 grid gap-6 text-center md:grid-cols-4 md:text-left">
          <div>
            <h4 className="font-semibold">About</h4>
            <ul className="text-sm text-gray-600">
              <li>CAKE DENIM</li>
              <li>Careers</li>
              <li>Affiliates</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold">Help</h4>
            <ul className="text-sm text-gray-600">
              <li>Contact</li>
              <li>FAQ</li>
              <li>Size guide</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold">Account</h4>
            <ul className="text-sm text-gray-600">
              <li>Sign in</li>
              <li>Returns & Exchanges</li>
              <li>Order lookup</li>
              <li>E-gift cards</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold">Social</h4>
            <ul className="text-sm text-gray-600">
              <li>Instagram</li>
              <li>Facebook</li>
              <li>Pinterest</li>
            </ul>
          </div>
        </div>

        {/* Right section with newsletter sign-up */}
        <div className="container mx-auto mb-10 text-center">
          <div className="inline-flex overflow-hidden rounded-lg border border-black">
            <input
              type="text"
              placeholder="We make great emails"
              className="w-60 p-2 px-4 focus:outline-none"
            />
            <button className="bg-black p-2 px-4 text-white">Sign up</button>
          </div>
        </div>
      </div>

      {/* Bottom section with legal links */}
      <div className="container mx-auto text-center text-sm text-gray-600">
        <p className="mb-2">
          <span className="mr-4">Do Not Sell My Info</span>
          <span className="mr-4">Terms</span>
          <span className="mr-4">Privacy</span>
          <span className="mr-4">California Privacy Notice</span>
          <span className="mr-4">Sitemap</span>
          <span className="mr-4">Accessibility</span>
          <span className="mr-4">CA Supply Chain</span>
        </p>
        <p>© 2024 CAKE DENIM</p>
      </div>
    </footer>
  );
};

export default Footer;
