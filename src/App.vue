<script setup>
import { computed, ref } from "vue";
import { useHead } from "@unhead/vue";
import ResultSection from "./components/ResultSection.vue";
import FormInput from "./components/FormInput.vue";
import { calculate } from "./lib/core";
import { monthlyTaxRates } from "./lib/rates";
import { formatLongDate } from "./lib/dates";

useHead({
  title: "PAYE Calculator",
  meta: [{ name: "description", content: "Estimate your monthly take-home pay in Ghana, including PAYE income tax and employee pension contributions." }]
});
const grossIncome = ref("");
const allowances = ref("");
const taxRelief = ref("");
const taxResult = computed(() => calculate(grossIncome.value, allowances.value, taxRelief.value));
const ratesEffectiveFrom = formatLongDate(monthlyTaxRates.effectiveFrom);
function reset() {
  grossIncome.value = "";
  allowances.value = "";
  taxRelief.value = "";
}
</script>

<template>
  <div class="app-shell">
    <header class="site-header">
      <a class="brand" href="./" aria-label="PAYE Calculator home"><span class="brand-mark" aria-hidden="true">₵</span> PAYE Calculator</a>
      <span class="country">Ghana · GHS</span>
    </header>
    <main>
      <section class="intro" aria-labelledby="page-title">
        <p class="eyebrow">YOUR MONTHLY PAY, EXPLAINED</p>
        <h1 id="page-title">PAYE Calculator</h1>
        <p class="intro-copy">See what comes home.<br />Understand your tax and pension deductions in seconds.</p>
        <a class="rate-link" href="https://gra.gov.gh/domestic-tax/tax-types/paye/" target="_blank" rel="noopener noreferrer">GRA rates effective {{ ratesEffectiveFrom }} <span aria-hidden="true">↗</span></a>
      </section>
      <div class="calculator-layout">
        <section class="input-card" aria-labelledby="input-title">
          <div class="card-heading"><div><p class="eyebrow">START HERE</p><h2 id="input-title">Your monthly income</h2></div><button class="text-button" type="button" @click="reset">Reset</button></div>
          <form @submit.prevent>
            <FormInput id="gross-income" label="Basic salary" hint="Your monthly salary before deductions." v-model="grossIncome" />
            <FormInput id="allowances" label="Taxable allowances" hint="Add your monthly taxable allowances, if any." v-model="allowances" />
            <FormInput id="tax-relief" label="Approved tax relief" hint="Use the monthly equivalent of your approved relief. Leave blank if none." v-model="taxRelief" />
          </form>
          <p class="privacy-note">Calculated on your device. Your salary stays in this browser.</p>
        </section>
        <div class="result-column">
          <div v-if="taxResult.errorMessage" class="error-card" role="alert"><h2>Check your amounts</h2><p>{{ taxResult.errorMessage }}</p><p>Use an amount such as 5,000.00.</p></div>
          <ResultSection v-else :tax-result="taxResult" />
        </div>
      </div>
      <section class="guidance" aria-labelledby="guidance-title">
        <h2 id="guidance-title">A little clarity before payday</h2>
        <div class="guidance-grid">
          <div><h3>PAYE income tax</h3><p>Tax is calculated progressively. Each portion of your taxable income falls into its own tax band.</p></div>
          <div><h3>Employee pension</h3><p>Your deduction is 5.5% of basic salary, using the 2026 maximum insurable earnings of GH₵69,000.</p></div>
          <div><h3>About this estimate</h3><p>For resident employees paid monthly. Bonuses, non-resident income and other payroll deductions require separate treatment.</p></div>
        </div>
      </section>
    </main>
    <footer class="site-footer">
      <div><strong>PAYE Calculator</strong><p>An estimate to help you plan. Confirm your final figures with payroll.</p><small>© 2026 Kwabena Acquaah · Original contributions. Upstream rights reserved.</small></div>
      <nav aria-label="Footer"><a href="https://github.com/kwabenaacquaah/taxcalculatorgh/issues">Send feedback ↗</a><a href="https://github.com/kwabenaacquaah/taxcalculatorgh/blob/main/LICENSE">Rights &amp; permissions ↗</a></nav>
    </footer>
  </div>
</template>
