"use client"

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Leaf,
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageCircle,
  Store,
} from "lucide-react";
import {
  FaInstagram,
  FaFacebookF,
  FaYoutube,
} from "react-icons/fa";

export function SiteFooter() {
  const [branchStatus, setBranchStatus] = useState({
    branch1: false,
    branch2: false,
  });

  useEffect(() => {
    const checkStatus = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const currentTime = hours + minutes / 60;

      // Branch 1: 12:00 PM - 4:00 PM & 7:00 PM - 11:00 PM
      const branch1Open1 = currentTime >= 12 && currentTime < 16;
      const branch1Open2 = currentTime >= 19 && currentTime < 23;
      const isBranch1Open = branch1Open1 || branch1Open2;

      // Branch 2: 7:00 AM - 9:00 PM
      const isBranch2Open = currentTime >= 7 && currentTime < 21;

      setBranchStatus({
        branch1: isBranch1Open,
        branch2: isBranch2Open,
      });
    };

    checkStatus();
    const interval = setInterval(checkStatus, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <footer id="site-footer" className="border-t border-border/60 bg-card">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 md:grid-cols-12">
          {/* Brand - 4 columns */}
          <div className="md:col-span-4 space-y-3">
            <Link href="/" className="flex items-center gap-2">
              <Leaf className="h-6 w-6 text-green-600" aria-hidden="true" />
              <span className="font-serif text-xl font-bold">
                The Tamarind Pure Veg
              </span>
            </Link>

            <p className="text-sm text-muted-foreground max-w-xs">
              Authentic Indian vegetarian cuisine made with love and fresh
              ingredients.
            </p>

            {/* Social Media */}
            <div className="flex items-center gap-3 pt-2">
              <Link
                href="https://www.instagram.com/tamarind_pure_veg/"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-muted p-2 transition-all hover:bg-pink-600 hover:text-white"
                aria-label="Instagram"
              >
                <FaInstagram className="h-4 w-4" />
              </Link>

              <Link
                href="https://www.facebook.com/profile.php?id=61592567273004"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-muted p-2 transition-all hover:bg-blue-600 hover:text-white"
                aria-label="Facebook"
              >
                <FaFacebookF className="h-4 w-4" />
              </Link>

              <Link
                href="https://youtube.com/@yourchannel"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-muted p-2 transition-all hover:bg-red-600 hover:text-white"
                aria-label="YouTube"
              >
                <FaYoutube className="h-4 w-4" />
              </Link>

              <Link
                href="mailto:abhaygouraj@gmail.com"
                className="rounded-full bg-muted p-2 transition-all hover:bg-primary hover:text-primary-foreground"
                aria-label="Email"
              >
                <Mail className="h-4 w-4" />
              </Link>

              <Link
                href="https://wa.me/918792571008"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-muted p-2 transition-all hover:bg-green-600 hover:text-white"
                aria-label="WhatsApp"
              >
                <MessageCircle className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Branches - 5 columns */}
          <div className="md:col-span-5">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Our Branches
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* The Tamarind Pure Veg B1 */}
              <div>
                <p className="text-sm font-medium text-foreground flex items-center gap-1">
                  <Store className="h-3.5 w-3.5 text-green-600" />
                  The Tamarind Pure Veg B1
                </p>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  RK Colony, Nippani Road,
                  <br />
                  Beside Canara Bank,
                  <br />
                  Chikodi 591201
                </p>
                <p className="text-xs text-muted-foreground/70 mt-1">
                   12:00 PM - 4:00 PM & 7:00 PM - 11:00 PM
                </p>
                <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium mt-1.5 ${
                  branchStatus.branch1 
                    ? 'bg-green-600/10 text-green-600' 
                    : 'bg-red-600/10 text-red-600'
                }`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${
                    branchStatus.branch1 ? 'bg-green-600 animate-pulse' : 'bg-red-600'
                  }`} />
                  {branchStatus.branch1 ? 'Open Now' : 'Closed'}
                </span>
              </div>

              {/* The Tamarind Pure Veg B2 */}
              <div>
                <p className="text-sm font-medium text-foreground flex items-center gap-1">
                  <Store className="h-3.5 w-3.5 text-green-600" />
                  The Tamarind Pure Veg B2
                </p>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  Basaveshwar Circle,
                  <br />
                  Opp. KLE Hospital,
                  <br />
                  Chikodi 591201
                </p>
                <p className="text-xs text-muted-foreground/70 mt-1">
                   7:00 AM - 9:00 PM
                </p>
                <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium mt-1.5 ${
                  branchStatus.branch2 
                    ? 'bg-green-600/10 text-green-600' 
                    : 'bg-red-600/10 text-red-600'
                }`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${
                    branchStatus.branch2 ? 'bg-green-600 animate-pulse' : 'bg-red-600'
                  }`} />
                  {branchStatus.branch2 ? 'Open Now' : 'Closed'}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Links - 3 columns  */}
          <div className="md:col-span-3 md:pl-4">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Quick Links
            </h3>

            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Home
                </Link>
              </li>

              <li>
                <Link
                  href="/menu"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Menu
                </Link>
              </li>

              <li>
                <Link
                  href="/booking"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Book a Table
                </Link>
              </li>

              <li className="pt-2">
                <Link
                  href="tel:+918792571008"
                  className="text-muted-foreground transition-colors hover:text-foreground flex items-center gap-2"
                >
                  <Phone className="h-3.5 w-3.5" />
                  +91 87925 71008
                </Link>
              </li>

              <li>
                <Link
                  href="mailto:abhaygouraj@gmail.com"
                  className="text-muted-foreground transition-colors hover:text-foreground flex items-center gap-2"
                >
                  <Mail className="h-3.5 w-3.5" />
                  abhaygouraj@gmail.com
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-border/60 pt-6 text-center text-xs text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} The Tamarind Pure Veg. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}