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
import { Button } from "@/components/ui/button";

const Navigation = () => {
  return (
    <>
      {/* Top Bar for "Shipping" and other info */}
      <div className="w-full h-8 bg-gray-100 text-sm flex justify-center items-center">
        <span>SHIPPING TO UNITED STATES</span>
      </div>

      {/* Main Navigation */}
      <div className="w-full h-16 flex justify-between items-center px-8 sticky top-0 bg-white z-50 border-b">
        {/* Logo Section */}
        <div className="flex items-center gap-4">
          <Image
            src="/assets/plura-logo.svg" // Update with the correct logo path
            width={50}
            height={50}
            alt="Logo"
          />
          <span className="font-serif text-2xl">cult gaia</span>
        </div>
        {/* Center Navigation */}
        <ul className="flex gap-8 text-md uppercase tracking-wide">
          {/* Navigation Dropdowns */}
          <nav className="container mx-auto">
            <NavigationMenu>
              <NavigationMenuList className="flex justify-center gap-8">
                <NavigationMenuItem>
                  <NavigationMenuTrigger>SHOP</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="w-full grid gap-5 p-10 md:lg:grid-col-6 lg:grid-col-6">
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
                    <ul className="grid gap-5 p-10 md:grid-cols-3">
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
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger>NEW</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid gap-5 p-10 md:grid-cols-3">
                      <li>
                        <ListItem href="/collections/jeans" title="Jeans">
                          Sustainable denim jeans for every occasion.
                        </ListItem>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </nav>
        </ul>
        {/* Right Side Options */}
        <div className="flex gap-6 items-center">
          <Link href="/saved">Saved</Link>
          <Link href="/login">Login</Link>
        </div>
      </div>
    </>
  );
};

// ListItem component remains the same as your original version
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
            className
          )}
          {...props}
        >
          <div className="relative h-24 w-24 mb-2">
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
