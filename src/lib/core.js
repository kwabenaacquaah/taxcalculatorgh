import { Decimal } from "decimal.js";
import { monthlyTaxRates, SSNIT_RATE, SSNIT_MAX_INSURABLE_EARNINGS } from "./rates";

function calculate(grossInput, allowancesInput, taxReliefInput) {
  const inputs = [grossInput, allowancesInput, taxReliefInput].map(normalizeAmount);
  const labels = ["Monthly basic income", "Monthly allowances", "Monthly tax relief"];
  const invalidIndex = inputs.findIndex((value) => !isValidNumber(value));
  if (invalidIndex !== -1) {
    return { errorMessage: `Please enter a valid non-negative amount for ${labels[invalidIndex]}.` };
  }
  [grossInput, allowancesInput, taxReliefInput] = inputs;

  return computeTaxes({
    grossIncome: new Decimal(grossInput),
    allowances: new Decimal(allowancesInput),
    taxRelief: new Decimal(taxReliefInput),
    taxRates: monthlyTaxRates.rates
  });
}

function computeTaxes({ grossIncome, allowances, taxRelief, taxRates }) {

  let totalTax = new Decimal(0);
  const ssnitContribution = Decimal.min(grossIncome, SSNIT_MAX_INSURABLE_EARNINGS).times(SSNIT_RATE).dividedBy(100).toDecimalPlaces(2);

  const totalTaxRelief = ssnitContribution.plus(taxRelief);

  let taxableRemaining = new Decimal(grossIncome).minus(totalTaxRelief).plus(allowances);

  const computationBreakdown = [
    {
      taxRate: 0,
      taxAmount: 0,
      amountTaxed: 0
    }
  ];

  for (let i = 0; i < taxRates.length; i++) {
    if (taxableRemaining.gt(0)) {
      const [taxRate, taxableAmount] = taxRates[i];
      const actualTaxableAmount = taxableRemaining.gt(taxableAmount)
        ? new Decimal(taxableAmount)
        : taxableRemaining;

      const trancheTax = new Decimal(taxRate).times(actualTaxableAmount).dividedBy(100);

      totalTax = totalTax.plus(trancheTax);

      computationBreakdown[i] = {
        taxRate,
        taxAmount: trancheTax.toFixed(2),
        amountTaxed: actualTaxableAmount.toFixed(2)
      };

      taxableRemaining = taxableRemaining.minus(actualTaxableAmount);
    }
  }

  // Round deductions to the pesewa before deriving net, so the displayed figures add up
  const incomeTax = totalTax.toDecimalPlaces(2);
  const netIncome = grossIncome.plus(allowances).minus(incomeTax).minus(ssnitContribution);

  return {
    incomeTax: incomeTax.toFixed(2),
    ssnit: ssnitContribution.toFixed(2),
    netIncome: netIncome.toFixed(2),
    computationBreakdown
  };
}

function normalizeAmount(value) {
  const text = String(value).trim();
  if (text === "") return "0";
  // Remove commas only when they form complete groups of three digits.
  if (/^[+]?\d{1,3}(,\d{3})+(\.\d*)?$/.test(text)) return text.replaceAll(",", "");
  return text;
}

function isPositiveNumber(number) {
  const positiveNumberRegex = /^[+]?([0-9]+(?:[.][0-9]*)?|\.[0-9]+)$/;
  return positiveNumberRegex.test(number);
}

function isValidNumber(val) {
  if (val === "") return false;
  return isPositiveNumber(val);
}

export { monthlyTaxRates, calculate };
