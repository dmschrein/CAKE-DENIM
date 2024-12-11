"use client";

import { useSession } from "next-auth/react";
import React, { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { HeartIcon } from "@radix-ui/react-icons";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
// import { setIsSidebarCollapsed } from "@/state";
// import { useAppDispatch, useAppSelector } from "@/app/redux";
import { useCart } from "@/providers/CartProvider";
import SideCart from "./SideCart";
import { SigninForm } from "../forms/SigninForm";
import CreateAccountForm from "../forms/CreateAccountForm";
import CustomImage from "../common/CustomImage";

const components: {
  title: string;
  image: string;
  fallbackSrc: string;
  href: string;
}[] = [
  {
    title: "Fall Basics",
    image: "https://s3-cakedenim.s3.us-west-1.amazonaws.com/cakebabe.png",
    fallbackSrc: "/assets/cakebabe.png",
    href: "/products/jeans",
  },
  {
    title: "Gift Guide",
    href: "/products/jeans",
    image: "https://s3-cakedenim.s3.us-west-1.amazonaws.com/cakebabe.png",
    fallbackSrc: "/assets/cakebabe.png",
  },
  {
    title: "CAKE Travel Essentials",
    href: "/products/jeans",
    image: "https://s3-cakedenim.s3.us-west-1.amazonaws.com/cakebabe.png",
    fallbackSrc: "/assets/cakebabe.png",
  },
  {
    title: "Escape with US",
    href: "/products/jeans",
    image: "https://s3-cakedenim.s3.us-west-1.amazonaws.com/cakebabe.png",
    fallbackSrc: "/assets/cakebabe.png",
  },
  {
    title: "Sexy Sustainables",
    href: "/products/jeans",
    image: "https://s3-cakedenim.s3.us-west-1.amazonaws.com/cakebabe.png",
    fallbackSrc: "/assets/cakebabe.png",
  },
  {
    title: "Desirable Denim",
    href: "/products/jeans",
    image: "https://s3-cakedenim.s3.us-west-1.amazonaws.com/cakebabe.png",
    fallbackSrc: "/assets/cakebabe.png",
  },
];

const Navigation = () => {
  const { countAllItems } = useCart();
  const [showSideCart, setShowSideCart] = useState(false);
  const [showSigninModal, setShowSigninModal] = useState(false);
  const [showCreateAccountModal, setShowCreateAccountModal] = useState(false);
  const cartItems = countAllItems();

  // Retrieve the user's session status from NextAuth
  const { status } = useSession();
  console.log("Navigation user status:", status);
  const isLoggedIn = status === "authenticated";

  const handleSignin = () => {
    console.log("Sign In button clicked");
    setShowSigninModal(true);
    setShowCreateAccountModal(false);
  };

  const handleCreateAccount = () => {
    console.log("Create Account button clicked");
    setShowSigninModal(false);
    setShowCreateAccountModal(true);
  };

  return (
    <>
      {/* Top Bar for "Shipping" and other info */}
      <div className="flex h-8 w-full items-center justify-center bg-gray-100 text-sm">
        <span>FREE SHIPPING TO UNITED STATES</span>
      </div>

      {/* Main Navigation */}
      <div className="sticky top-0 z-40 flex h-20 w-full items-center justify-between border-b bg-white px-8">
        {/* Logo Section */}
        <div className="flex items-center gap-4">
          <CustomImage
            src={
              "https://s3-cakedenim.s3.us-west-1.amazonaws.com/norlogo27.png"
            } // Update with the correct logo path
            fallbackSrc={"/assets/norlogo27.png"}
            width={30}
            height={30}
            alt="Logo"
          />
          <span className="font-serif text-2xl">CAKE DENIM</span>
        </div>
        {/* Center Navigation */}
        <ul className="text-md flex gap-8 uppercase tracking-wide">
          {/* Navigation Dropdowns */}
          <nav className="container mx-auto">
            <NavigationMenu>
              <NavigationMenuList className="flex justify-center gap-8">
                <NavigationMenuItem>
                  <NavigationMenuTrigger>SHOP</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="fixed left-0 right-0 grid gap-5 bg-blue-50 p-10 md:w-[800px] lg:w-full lg:grid-cols-3">
                      <li>
                        <ListItem href="/products?category=Jeans" title="Jeans">
                          Sustainable denim jeans for every occasion.
                        </ListItem>
                        <ListItem href="/products?category=Tops" title="Tops">
                          Tencel and modal tops.
                        </ListItem>
                      </li>
                      <li>
                        <ListItem
                          href="/products?category=Jackets"
                          title="Jackets"
                        >
                          Comfortable and convertible jackets.
                        </ListItem>
                        <ListItem
                          href="/products?category=Dresses"
                          title="Dresses"
                        >
                          Dresses for your vacations.
                        </ListItem>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <a
                            className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                            href="/jackets"
                          >
                            <CustomImage
                              src="https://s3-cakedenim.s3.us-west-1.amazonaws.com/kennedy3-71.jpg"
                              fallbackSrc="/assets/kennedy3-71.jpg"
                              width={500}
                              height={500}
                              alt="Jacket Featured Collection"
                            />
                            <div>Featured</div>
                            <p className="text-sm leading-tight text-muted-foreground">
                              Our beautifully designed convertible collection.
                            </p>
                          </a>
                        </NavigationMenuLink>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger>COLLECTIONS</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="fixed left-0 grid gap-5 bg-blue-50 p-10 md:w-[800px] md:grid-cols-6 lg:w-full">
                      {components.map((component) => (
                        <ListItem
                          key={component.title}
                          title={component.title}
                          image={component.image}
                          href={component.href}
                        ></ListItem>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link href="/products/shopAll" legacyBehavior passHref>
                    <NavigationMenuLink
                      className={navigationMenuTriggerStyle()}
                    >
                      NEW
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </nav>
        </ul>
        {/* Right Side Options */}
        <div className="flex items-center gap-6">
          <div className="flex items-center">
            <Link href="/saved">Favorites</Link>
            <HeartIcon className="h-4 w-4" />
          </div>
          {/* Check if user is logged in
           * TODO: Add Account link with Sign Out option
           */}
          {isLoggedIn ? (
            // if user is not logged in, render sign out button
            // <button
            //   onClick={handleSignOutClicked}
            //   className="text-sm underline"
            // >
            //   Sign Out
            // </button>
            <Link href={`/account`}>My Account</Link>
          ) : (
            // if the user is already logged in, change Sign In to Account on Nav bar
            <button onClick={handleSignin} className="text-sm underline">
              Sign In
            </button>
          )}
          {/* Side cart */}
          <button
            onClick={() => setShowSideCart((prev) => !prev)}
            className="relative rounded-full bg-gray-200 p-3"
          >
            <ShoppingBagOutlinedIcon />
            {cartItems > 0 ? (
              <div className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-blue-950 bg-opacity-70 text-xs font-semibold text-white">
                <p>{cartItems >= 9 ? "9+" : cartItems}</p>
              </div>
            ) : null}
          </button>
        </div>
      </div>
      <SideCart
        visible={showSideCart}
        onRequestClose={() => setShowSideCart(false)}
      />
      {/* Signin Modal */}
      {showSigninModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <SigninForm
            handleClose={() => setShowSigninModal(false)}
            onCreateAccountClick={handleCreateAccount} // if user clicks "Create Account" go to CreateAccountForm
          />
        </div>
      )}

      {/* Create Account Modal */}
      {showCreateAccountModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <CreateAccountForm
            handleClose={() => setShowCreateAccountModal(false)} // close the create modal account
          />
        </div>
      )}
    </>
  );
};

// ListItem component
const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & { image?: string; title: string }
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className,
          )}
          {...props}
        >
          <div className="relative mb-2 h-44 w-28">
            <CustomImage
              src={
                "https://s3-cakedenim.s3.us-west-1.amazonaws.com/cakebabe.png"
              }
              fallbackSrc={"/assets/cakebabe.png"}
              alt={title}
            />
          </div>

          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

export default Navigation;
