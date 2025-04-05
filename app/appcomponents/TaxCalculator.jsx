"use client";

import { useState } from "react";
import Image from "next/image";
import { FaInfoCircle } from "react-icons/fa"; // Info icon
import { motion } from "framer-motion";

export default function TaxCalculator() {
  const [income, setIncome] = useState({
    salaryIncome: "",
    interest: "",
    rental: "",
    other: "",
  });
  const [tax, setTax] = useState(0);
  const [details, setDetails] = useState(null);
  const [showInfo, setShowInfo] = useState(false); // Toggle info panel

  const usageGuide = `
New Tax Regime Calculator Usage Guide (FY 2025-26):

1. Income Sources:
   - Salary Income: Enter your annual salary in rupees (e.g., 1200000 for ₹12,00,000).
   - Interest: Income from savings, FDs, etc.
   - Rental: Income from rented properties.
   - Other: Any additional income.

2. Standard Deduction:
   - Automatically applies ₹75,000 deduction to total income.

3. Tax Slabs (New Regime):
   - ₹0 – ₹4,00,000: 0%
   - ₹4,00,001 – ₹8,00,000: 5%
   - ₹8,00,001 – ₹12,00,000: 10%
   - ₹12,00,001 – ₹16,00,000: 15%
   - ₹16,00,001 – ₹20,00,000: 20%
   - ₹20,00,001 – ₹24,00,000: 25%
   - Above ₹24,00,000: 30%

4. Rebate & Marginal Relief:
   - Total income ≤ ₹12,75,000: No tax (full rebate).
   - Income > ₹12,75,000: Tax limited to excess over ₹12,75,000 (before cess).

5. Cess:
   - 4% Health & Education Cess added to final tax.

6. Results:
   - Displays total income, taxable income, computed tax, cess, and final tax payable.
   - Test marginal relief with salary ≥ ₹1,276,000.

Note: Tax may vary based on additional exemptions not included here.
  `;
  const STANDARD_DEDUCTION = 75000;
  // Total income up to ₹12,75,000 is effectively tax-free for eligible individuals.
  const REBATE_LIMIT = 1275000;
  const CESS_RATE = 0.04;

  const handleChange = (e) => {
    setIncome({ ...income, [e.target.name]: e.target.value });
  };

  const calculateTax = () => {
    const totalIncome = Object.values(income).reduce(
      (acc, val) => acc + (Number(val) || 0),
      0
    );
    // Taxable Income is total income minus the standard deduction
    const taxableIncome = Math.max(0, totalIncome - STANDARD_DEDUCTION);

    let computedTax = 0;
    // Calculate tax using the following slabs:
    // ₹0 – ₹4,00,000: 0%
    // ₹4,00,001 – ₹8,00,000: 5%
    // ₹8,00,001 – ₹12,00,000: 10%
    // Above ₹12,00,000: 15%
    if (taxableIncome > 400000) {
      const amount = Math.min(taxableIncome, 800000) - 400000;
      computedTax += amount * 0.05;
    }
    if (taxableIncome > 800000) {
      const amount = Math.min(taxableIncome, 1200000) - 800000;
      computedTax += amount * 0.1;
    }
    if (taxableIncome > 1200000) {
      const amount = Math.min(taxableIncome, 1600000) - 1200000;
      computedTax += amount * 0.15;
    }
    if (taxableIncome > 1600000) {
      const amount = Math.min(taxableIncome, 2000000) - 1600000;
      computedTax += amount * 0.2;
    }
    if (taxableIncome > 2000000) {
      const amount = Math.min(taxableIncome, 2400000) - 2000000;
      computedTax += amount * 0.25;
    }
    if (taxableIncome > 2400000) {
      const amount = taxableIncome - 2400000;
      computedTax += amount * 0.3;
    }

    let finalTaxBeforeCess = 0;
    // If total income is less than or equal to ₹12,75,000, no tax is payable.
    if (totalIncome <= REBATE_LIMIT) {
      finalTaxBeforeCess = 0;
    } else {
      // Marginal relief: the tax (before cess) is limited to the excess income over ₹12,75,000.
      finalTaxBeforeCess = Math.min(computedTax, totalIncome - REBATE_LIMIT);
    }

    const cess = finalTaxBeforeCess * CESS_RATE;
    const finalTax = finalTaxBeforeCess + cess;

    setTax(finalTax);
    setDetails({
      totalIncome,
      standardDeductions: STANDARD_DEDUCTION,
      taxableIncome,
      computedTax,
      finalTaxBeforeCess,
      taxPayable: finalTax,
      cess,
    });
  };
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut", staggerChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95 },
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-r from-sky-300 to-sky-700 text-white">
      <div className="bg-white shadow-2xl rounded-lg p-8 w-full max-w-2xl border border-gray-300 text-gray-800">
        <div className="flex justify-center">
          <Image
            src="/VijayLogo.jpg"
            alt="Vijay Kumar Pydi Logo"
            width={100}
            height={100}
            className="rounded-full"
          />
        </div>
        <motion.div
          variants={itemVariants}
          className="flex flex-col items-center relative mb-6"
        >
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-sky-700 text-center">
              New Tax Regime Calculator
            </h1>
            <FaInfoCircle
              className="text-sky-400 cursor-pointer text-xl md:text-2xl"
              onClick={() => setShowInfo(!showInfo)}
            />
          </div>
          <p className="text-sm text-purple-600 mt-1 text-center">
            FY 2025–26 (New Tax Regime)
          </p>
        </motion.div>

        {showInfo && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-40 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="relative bg-white rounded-2xl shadow-2xl border border-sky-300 w-full max-w-lg max-h-[80vh] overflow-y-auto p-6"
            >
              <button
                className="absolute top-3 right-4 text-sky-700 font-bold text-xl hover:text-red-500 transition"
                onClick={() => setShowInfo(false)}
              >
                ×
              </button>
              <h3 className="text-2xl font-bold mb-4 text-sky-700 text-center">
                Usage Guide
              </h3>
              <pre className="whitespace-pre-wrap text-sm text-purple-700 leading-relaxed">
                {usageGuide}
              </pre>
            </motion.div>
          </motion.div>
        )}

        <div className="grid grid-cols-2 gap-6">
          {Object.keys(income).map((key) => (
            <div key={key} className="flex flex-col">
              <label className="block font-semibold capitalize text-gray-700">
                {key.replace(/([A-Z])/g, " $1")}
              </label>
              <input
                type="number"
                name={key}
                value={income[key]}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none shadow-md text-gray-900"
                placeholder="₹"
              />
            </div>
          ))}
        </div>
        <button
          onClick={calculateTax}
          className="bg-sky-600 text-white px-5 py-3 rounded-lg w-full mt-6 hover:bg-sky-700 transition font-semibold shadow-lg"
        >
          Calculate Tax
        </button>
        <p className="mt-2 text-sm text-center text-gray-700 bg-sky-100 p-2 rounded-lg shadow-md border border-sky-300">
          <strong>Note:</strong> Tax payable may vary depending on the
          exemptions allowed as per the tax act. (For testing marginal relief,
          please enter a salary income of ₹1,276,000 or above.)
        </p>
        <h2 className="text-3xl font-semibold text-center mt-6 text-sky-700">
          Tax Payable: ₹{tax.toFixed(2)}
        </h2>
        {details && (
          <div className="mt-6 p-6 bg-sky-100 rounded-lg shadow-xl border border-sky-400">
            <h3 className="text-2xl font-semibold mb-4 text-sky-700">
              Calculation Summary
            </h3>
            <div className="grid grid-cols-2 gap-4 text-gray-800">
              <p className="font-medium">Total Income:</p>{" "}
              <p>₹{details.totalIncome}</p>
              <p className="font-medium">Standard Deductions:</p>{" "}
              <p>₹{details.standardDeductions}</p>
              <p className="font-medium">Taxable Income:</p>{" "}
              <p>₹{details.taxableIncome}</p>
              <p className="font-medium">Computed Tax (Without Relief):</p>{" "}
              <p>₹{details.computedTax.toFixed(2)}</p>
              <p className="font-medium">
                Tax Before Cess (After Marginal Relief):
              </p>{" "}
              <p>₹{details.finalTaxBeforeCess.toFixed(2)}</p>
              <p className="font-medium">Health & Education Cess:</p>{" "}
              <p>₹{details.cess}</p>
              <p className="font-medium">Tax Payable (With Cess):</p>{" "}
              <p className="text-red-500 font-semibold">
                ₹{details.taxPayable.toFixed(2)}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
