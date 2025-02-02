'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaShoppingCart, FaSearch, FaTrophy, FaHome, FaPlusSquare, FaStore, FaUser } from 'react-icons/fa';
import styles from '../../styles/shop.module.css';
import Navbar from "@/components/Navbar";

const products = [
  { name: "Stussy", price: "$120.99", image: "/stussy-sweater.png" }, // Replace with actual product images
  { name: "Stussy", price: "$120.99", image: "/stussy-sweater.png" },
  { name: "Stussy", price: "$120.99", image: "/stussy-sweater.png" },
  { name: "Stussy", price: "$120.99", image: "/stussy-sweater.png" }
];

export default function Shop() {
  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <Image src="/ootd.svg" alt="OOTD" width={200} height={100} />
        <div className={styles.cartIcon}>
          <FaShoppingCart size={24} />
          <span className={styles.cartBadge}>1</span>
        </div>
      </header>

      {/* Search Bar */}
      <div className={styles.searchBar}>
        <input type="text" placeholder="What are you looking for?" />
        <FaSearch className={styles.searchIcon} />
      </div>

      {/* Upper Wear Section */}
      <section className={styles.section}>
        <h2>Upper Wear</h2>
        <div className={styles.productGrid}>
          {products.map((product, index) => (
            <div key={index} className={styles.productCard}>
              <Image src={product.image} alt={product.name} width={120} height={120} />
              <p>{product.name}</p>
              <p className={styles.price}>{product.price}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Lower Wear Section */}
      <section className={styles.section}>
        <h2>Lower Wear</h2>
        <div className={styles.productGrid}>
          {products.map((product, index) => (
            <div key={index} className={styles.productCard}>
              <Image src={product.image} alt={product.name} width={120} height={120} />
              <p>{product.name}</p>
              <p className={styles.price}>{product.price}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom Navigation */}
      <Navbar />
    </div>
  );
}
