"use client";

import React from "react";
import Image from "next/image";
import { FaShoppingCart, FaSearch } from "react-icons/fa";
import Navbar from "@/components/Navbar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const products = [
  { name: "Stussy", price: "$120.99", image: "/stussy-sweater.png" }, // Replace with actual product images
  { name: "Stussy", price: "$120.99", image: "/stussy-sweater.png" },
  { name: "Stussy", price: "$120.99", image: "/stussy-sweater.png" },
  { name: "Stussy", price: "$120.99", image: "/stussy-sweater.png" },
];

export default function Shop() {
  return (
    <div className="px-3.5 pt-5 relative">
      <header className="flex justify-between items-center">
        <Image src="/ootd-shop.png" alt="OOTD" width={200} height={100} />
        <div className="relative">
          <FaShoppingCart size={24} />
        </div>
      </header>

      <div className="flex justify-center w-full my-5">
        <div className="relative w-4/5 z-[-1]">
          <Input
            placeholder="What are you looking for?"
            className="p-5 bg-gray-200 text-black placeholder:text-black rounded-full"
          />
          <FaSearch className="absolute top-1/2 right-2 -translate-y-1/2" />
        </div>
      </div>

      <section>
        <h2 className="text-xl font-bold">Upper Wear</h2>
        <div className="grid grid-cols-2 gap-4">
          {products.map((product, index) => (
            <div key={index} className="flex flex-col items-center p-4">
              <Image
                src="/stussy.png"
                alt={product.name}
                width={220}
                height={220}
              />
              <form>
                <Button>Try On</Button>
              </form>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold">Lower Wear</h2>
        <div className="grid grid-cols-2 gap-4">
          {products.map((product, index) => (
            <div key={index} className="flex flex-col items-center p-4">
              <Image
                src="/stussy.png"
                alt={product.name}
                width={220}
                height={220}
              />
              <form>
                <Button>Try On</Button>
              </form>
            </div>
          ))}
        </div>
      </section>

      <Navbar />
    </div>
  );
}
