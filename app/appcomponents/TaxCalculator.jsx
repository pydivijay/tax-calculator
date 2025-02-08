"use client";

import { useState } from "react";

export default function TaxCalculator() {
  const [income, setIncome] = useState({
    salaryIncome: "",
    interest: "",
    rental: "",
    other: "",
  });
  const [tax, setTax] = useState(0);
  const [details, setDetails] = useState(null);

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
      computedTax += amount * 0.10;
    }
    if (taxableIncome > 1200000) {
      const amount = Math.min(taxableIncome, 1600000) - 1200000;
      computedTax += amount * 0.15;
    }
    if (taxableIncome > 1600000) {
      const amount = Math.min(taxableIncome, 2000000) - 1600000;
      computedTax += amount * 0.20;
    }
    if (taxableIncome > 2000000) {
      const amount = Math.min(taxableIncome, 2400000) - 2000000;
      computedTax += amount * 0.25;
    }
    if (taxableIncome > 2400000) {
      const amount = taxableIncome - 2400000;
      computedTax += amount * 0.30;
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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-r from-sky-300 to-sky-700 text-white">
      <div className="bg-white shadow-2xl rounded-lg p-8 w-full max-w-2xl border border-gray-300 text-gray-800">
        <h1 className="text-4xl font-bold text-center mb-6 text-sky-700">
          New Tax Regime Calculator
        </h1>
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
          <strong>Note:</strong> Tax payable may vary depending on the exemptions allowed as per the tax act.
          (For testing marginal relief, please enter a salary income of ₹1,276,000 or above.)
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
              <p className="font-medium">Total Income:</p> <p>₹{details.totalIncome}</p>
              <p className="font-medium">Standard Deductions:</p> <p>₹{details.standardDeductions}</p>
              <p className="font-medium">Taxable Income:</p> <p>₹{details.taxableIncome}</p>
              <p className="font-medium">Computed Tax (Without Relief):</p> <p>₹{details.computedTax}</p>
              <p className="font-medium">Tax Before Cess (After Marginal Relief):</p> <p>₹{details.finalTaxBeforeCess}</p>
              <p className="font-medium">Health & Education Cess:</p> <p>₹{details.cess}</p>
              <p className="font-medium">Tax Payable (With Cess):</p> <p className="text-red-500 font-semibold">₹{details.taxPayable}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

