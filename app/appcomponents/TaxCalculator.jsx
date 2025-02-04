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
  const BASIC_EXEMPTION_LIMIT = 400000;
  const REBATE_LIMIT = 1275000;
  const CESS_RATE = 0.04;

  const handleChange = (e) => {
    setIncome({ ...income, [e.target.name]: e.target.value });
  };

  const calculateTax = () => {
    const totalIncome = Object.values(income).reduce((acc, val) => acc + (Number(val) || 0), 0);
    const taxableIncome = Math.max(0, totalIncome - STANDARD_DEDUCTION);

    let taxAmount = 0;
    const slabs = [
      { limit: 400000, rate: 0 },
      { limit: 800000, rate: 0.05 },
      { limit: 1200000, rate: 0.1 },
      { limit: 1600000, rate: 0.15 },
      { limit: 2000000, rate: 0.2 },
      { limit: 2400000, rate: 0.25 },
      { limit: Infinity, rate: 0.3 },
    ];

    let previousLimit = 0;
    for (const slab of slabs) {
      if (taxableIncome > previousLimit) {
        const taxableAmount = Math.min(taxableIncome, slab.limit) - previousLimit;
        taxAmount += taxableAmount * slab.rate;
      } else {
        break;
      }
      previousLimit = slab.limit;
    }

    if (taxableIncome <= REBATE_LIMIT) {
      taxAmount = 0;
    }

    const cess = taxAmount * CESS_RATE;
    taxAmount += cess;

    setTax(taxAmount);
    setDetails({
      totalIncome,
      standardDeductions: STANDARD_DEDUCTION,
      taxableIncome,
      taxPayable: taxAmount,
      incomeTax: taxAmount - cess,
      cess,
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-r from-sky-300 to-sky-700 text-white">
      <div className="bg-white shadow-2xl rounded-lg p-8 w-full max-w-2xl border border-gray-300 text-gray-800">
        <h1 className="text-4xl font-bold text-center mb-6 text-sky-700">New Tax Regime Calculator</h1>
        <div className="grid grid-cols-2 gap-6">
          {Object.keys(income).map((key) => (
            <div key={key} className="flex flex-col">
              <label className="block font-semibold capitalize text-gray-700">{key.replace(/([A-Z])/g, ' $1')}</label>
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
        </p>
        <h2 className="text-3xl font-semibold text-center mt-6 text-sky-700">Tax Payable: ₹{tax.toFixed(2)}</h2>
        {details && (
          <div className="mt-6 p-6 bg-sky-100 rounded-lg shadow-xl border border-sky-400">
            <h3 className="text-2xl font-semibold mb-4 text-sky-700">Calculation Summary</h3>
            <div className="grid grid-cols-2 gap-4 text-gray-800">
              <p className="font-medium">Total Income:</p> <p>₹{details.totalIncome}</p>
              <p className="font-medium">Standard Deductions:</p> <p>₹{details.standardDeductions}</p>
              <p className="font-medium">Taxable Income:</p> <p>₹{details.taxableIncome}</p>
              <p className="font-medium">Tax Payable:</p> <p className="text-red-500 font-semibold">₹{details.taxPayable}</p>
              <p className="font-medium">Income Tax:</p> <p>₹{details.incomeTax}</p>
              <p className="font-medium">Health and Education Cess:</p> <p>₹{details.cess}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
