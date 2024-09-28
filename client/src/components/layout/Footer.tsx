import React from "react";

const Footer = () => {
  return (
    <footer className="bg-white text-black py-20 border-t border-gray-300">
      {/* Upper section with icons */}
      <ul className="container mx-auto grid md:grid-cols-4 gap-6 text-center mb-20">
        <div>
          <div className="flex justify-center mb-2">
            {/* Icon for free shipping */}
            <span className="material-icons">local_shipping</span>
          </div>
          <h3 className="font-bold">Free shipping</h3>
          <p className="text-sm text-gray-600">
            Free returns on qualifying orders
          </p>
        </div>
        <div>
          <div className="flex justify-center mb-2">
            {/* Icon for Ref stores */}
            <span className="material-icons">store</span>
          </div>
          <h3 className="font-bold">Ref stores</h3>
          <p className="text-sm text-gray-600">We&apos;re all over the place</p>
        </div>
        <div>
          <div className="flex justify-center mb-2">
            {/* Icon for climate action */}
            <span className="material-icons">cloud</span>
          </div>
          <h3 className="font-bold">We&apos;re committed to climate action</h3>
          <p className="text-sm text-gray-600">And we have big plans</p>
        </div>
        <div>
          <div className="flex justify-center mb-2">
            {/* Icon for customer love */}
            <span className="material-icons">mail_outline</span>
          </div>
          <h3 className="font-bold">Customer love</h3>
          <p className="text-sm text-gray-600">We got you via email or text</p>
        </div>
      </ul>
      {/* Bottom section to manage the links and newsletter sign up */}
      <div className="grid md:grid-cols-2">
        {/* Left section with navigation and social links */}
        <div className="container mx-auto grid md:grid-cols-4 gap-6 text-center md:text-left mb-10">
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
        <div className="container mx-auto text-center mb-10">
          <div className="inline-flex border border-black rounded-lg overflow-hidden">
            <input
              type="text"
              placeholder="We make great emails"
              className="p-2 px-4 w-60 focus:outline-none"
            />
            <button className="bg-black text-white p-2 px-4">Sign up</button>
          </div>
        </div>
      </div>

      {/* Bottom section with legal links */}
      <div className="container mx-auto text-center text-gray-600 text-sm">
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
