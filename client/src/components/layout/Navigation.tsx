"use client";

import React from "react";
import Image from "next/image";
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
import { setIsSidebarCollapsed } from "@/state";
import { useAppDispatch, useAppSelector } from "@/app/redux";
import logo from "@/assets/cakedenim-logo.png";

const components: {
  title: string;
  image: string;
  href: string;
  description: string;
}[] = [
  {
    title: "Alert Dialog",
    image: "/assets/placeholder.png",
    href: "/docs/primitives/alert-dialog",
    description:
      "A modal dialog that interrupts the user with important content and expects a response.",
  },
  {
    title: "Hover Card",
    href: "/docs/primitives/hover-card",
    image: "/assets/placeholder.png",
    description:
      "For sighted users to preview content available behind a link.",
  },
  {
    title: "Progress",
    href: "/docs/primitives/progress",
    image: "/assets/placeholder.png",
    description:
      "Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.",
  },
  {
    title: "Scroll-area",
    href: "/docs/primitives/scroll-area",
    image: "/assets/placeholder.png",
    description: "Visually or semantically separates content.",
  },
  {
    title: "Tabs",
    href: "/docs/primitives/tabs",
    image: "/assets/placeholder.png",
    description:
      "A set of layered sections of content—known as tab panels—that are displayed one at a time.",
  },
  {
    title: "Tooltip",
    href: "/docs/primitives/tooltip",
    image: "/assets/placeholder.png",
    description:
      "A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.",
  },
];

const Navigation = () => {
  const dispatch = useAppDispatch();
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed,
  );

  const toggleSidebar = () => {
    dispatch(setIsSidebarCollapsed(!setIsSidebarCollapsed));
  };

  return (
    <>
      {/* Top Bar for "Shipping" and other info */}
      <div className="flex h-8 w-full items-center justify-center bg-gray-100 text-sm">
        <span>SHIPPING TO UNITED STATES</span>
      </div>

      {/* Main Navigation */}
      <div className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b bg-white px-8">
        {/* Logo Section */}
        <div className="flex items-center gap-4">
          <Image
            src={logo} // Update with the correct logo path
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
                    <ul className="fixed left-0 right-0 grid gap-5 bg-orange-100 p-10 md:w-[800px] lg:w-full lg:grid-cols-3">
                      <li>
                        <ListItem href="/collections/jeans" title="Jeans">
                          Sustainable denim jeans for every occasion.
                        </ListItem>
                        <ListItem href="/collections/tops" title="Tops">
                          Tencel and modal tops.
                        </ListItem>
                        <ListItem href="/collections/dresses" title="Dresses">
                          Dresses for your vacations.
                        </ListItem>
                      </li>
                      <li>
                        <ListItem href="/collections/shoes" title="Shoes">
                          Comfortable and sustainable shoes.
                        </ListItem>
                        <ListItem
                          href="/collections/accessories"
                          title="Accessories"
                        >
                          Ethical accessories for every outfit.
                        </ListItem>
                        <ListItem href="/collections/bags" title="Bags">
                          Durable, stylish bags for all occasions.
                        </ListItem>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <a
                            className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                            href="/"
                          >
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
                    <ul className="fixed left-0 grid gap-5 bg-orange-100 p-10 md:w-[800px] md:grid-cols-6 lg:w-full">
                      {components.map((component) => (
                        <ListItem
                          key={component.title}
                          title={component.title}
                          image={component.image}
                          href={component.href}
                        >
                          {component.description}
                        </ListItem>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link href="/collections/new" legacyBehavior passHref>
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
          <Link href="/login">Login</Link>
          <button
            className="rounded-full bg-gray-100 p-3 hover:bg-blue-100"
            onClick={toggleSidebar}
          >
            <ShoppingBagOutlinedIcon />
          </button>
        </div>
      </div>
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
          <div className="relative mb-2 h-24 w-24">
            <Image
              src={"/assets/placeholder.png"}
              alt={title}
              layout="fill"
              objectFit="cover"
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
