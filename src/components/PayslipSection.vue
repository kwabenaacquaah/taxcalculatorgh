<script setup>
import { computed, ref } from "vue";
import { Decimal } from "decimal.js";
import { monthlyTaxRates } from "../lib/rates";
import { formatLongDate } from "../lib/dates";

const props = defineProps({
  taxResult: { type: Object, required: true },
  basicIncome: [String, Number],
  allowances: [String, Number],
  taxRelief: [String, Number]
});
const employer = ref("");
const employee = ref("");
const employeeNumber = ref("");
const now = new Date();
const payMonth = ref(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`);
const message = ref("");
const formatter = new Intl.NumberFormat("en-GH", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const money = (value) => formatter.format(Number(value));
const amount = (value) => String(value).trim().replaceAll(",", "") || "0";
const totalDeductions = computed(() => {
  if (props.taxResult.errorMessage) return "0.00";
  return new Decimal(props.taxResult.incomeTax).plus(props.taxResult.ssnit).toFixed(2);
});
const totalEarnings = computed(() => {
  if (props.taxResult.errorMessage) return "0.00";
  return new Decimal(props.taxResult.netIncome).plus(totalDeductions.value).toFixed(2);
});
const monthLabel = computed(() => {
  if (!/^\d{4}-\d{2}$/.test(payMonth.value)) return "Select a month";
  const [year, month] = payMonth.value.split("-").map(Number);
  return new Intl.DateTimeFormat("en-GH", { month: "long", year: "numeric" }).format(new Date(year, month - 1, 1));
});
const validPeriod = computed(() => /^\d{4}-\d{2}$/.test(payMonth.value) && payMonth.value >= "2026-09" && payMonth.value <= "2026-12");
const ready = computed(() => !props.taxResult.errorMessage && validPeriod.value && employer.value.trim() && employee.value.trim() && new Decimal(totalEarnings.value).gt(0));
function printPayslip() {
  if (!ready.value) {
    message.value = "Enter valid earnings, employer and employee names, and a supported pay month before printing.";
    return;
  }
  message.value = "";
  window.print();
}
</script>
<template>
  <section id="payslip" class="payslip-section" aria-labelledby="payslip-title">
    <div class="workspace-heading"><div><h2 id="payslip-title">Generate a payslip</h2><p>Add the details below, review the preview, then print or save as PDF.</p></div></div>
    <div class="calculator-layout">
      <form class="input-card payslip-form" @submit.prevent="printPayslip">
        <h3>Employer &amp; employee</h3>
        <label for="employer-name">Employer name <span>Required</span></label>
        <input id="employer-name" v-model="employer" maxlength="120" autocomplete="organization" required />
        <label for="employee-name">Employee name <span>Required</span></label>
        <input id="employee-name" v-model="employee" maxlength="120" autocomplete="name" required />
        <label for="employee-number">Employee number <span>Optional</span></label>
        <input id="employee-number" v-model="employeeNumber" maxlength="50" autocomplete="off" />
        <label for="pay-month">Pay month</label>
        <input id="pay-month" v-model="payMonth" type="month" min="2026-09" max="2026-12" required aria-describedby="period-help" />
        <p id="period-help" class="field-hint">Supported months: September–December 2026, using the current PAYE bands and 2026 pension ceiling.</p>
        <p class="field-hint">Your earnings and deductions come from the calculator above. Check them before issuing a payslip.</p>
        <button class="print-button" type="submit">Print / Save PDF</button>
        <p class="field-hint">Choose “Save as PDF” in your browser’s print dialog. Disable browser headers and footers for a clean document.</p>
        <p v-if="message" class="print-error" role="alert">{{ message }}</p>
        <p class="privacy-note">Names and salary details stay on this device and clear when you reload.</p>
      </form>
      <div class="payslip-preview">
        <p v-if="taxResult.errorMessage" class="error-card" role="alert">Correct the amounts in the calculator to preview a payslip.</p>
        <article v-else id="payslip-document" class="payslip-document" aria-label="Payslip preview">
          <header class="slip-header"><div><p class="slip-kicker">MONTHLY PAYSLIP</p><h3>{{ employer.trim() || "Employer name" }}</h3></div><p>{{ monthLabel }}<br /><span>Ghana · GHS</span></p></header>
          <dl class="slip-employee"><div><dt>Employee</dt><dd>{{ employee.trim() || "Employee name" }}</dd></div><div v-if="employeeNumber.trim()"><dt>Employee number</dt><dd>{{ employeeNumber }}</dd></div></dl>
          <table class="slip-table"><caption>Earnings and deductions (GH₵)</caption><thead><tr><th scope="col">Earnings</th><th scope="col">Amount</th></tr></thead><tbody><tr><td>Basic salary</td><td>{{ money(amount(basicIncome)) }}</td></tr><tr><td>Taxable allowances</td><td>{{ money(amount(allowances)) }}</td></tr><tr class="slip-total"><th scope="row">Gross earnings</th><td>{{ money(totalEarnings) }}</td></tr></tbody></table>
          <table class="slip-table"><thead><tr><th scope="col">Deductions</th><th scope="col">Amount</th></tr></thead><tbody><tr><td>PAYE income tax</td><td>{{ money(taxResult.incomeTax) }}</td></tr><tr><td>Employee pension (SSNIT)</td><td>{{ money(taxResult.ssnit) }}</td></tr><tr class="slip-total"><th scope="row">Total deductions</th><td>{{ money(totalDeductions) }}</td></tr></tbody></table>
          <div class="slip-net"><span>Net pay</span><strong>GH₵ {{ money(taxResult.netIncome) }}</strong></div>
          <p class="slip-note">Monthly tax relief applied: GH₵ {{ money(amount(taxRelief)) }}. Relief reduces taxable income.</p>
          <footer class="slip-note">Prepared with PAYE Calculator · PAYE rates effective {{ formatLongDate(monthlyTaxRates.effectiveFrom) }}. Uses the 2026 pension ceiling. Covers entered basic salary and taxable allowances. Verify all payroll items before issue.</footer>
        </article>
      </div>
    </div>
  </section>
</template>
