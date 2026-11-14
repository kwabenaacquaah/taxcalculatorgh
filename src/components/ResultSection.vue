<script setup>
import { ref } from "vue";
defineProps({ taxResult: { type: Object, required: true } });
const showDetails = ref(false);
const formatter = new Intl.NumberFormat("en-GH", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const money = (value) => formatter.format(Number(value));
</script>
<template>
  <section class="results-card" aria-labelledby="result-title">
    <div class="take-home" aria-live="polite" aria-atomic="true">
      <p class="eyebrow">YOUR ESTIMATED TAKE-HOME</p>
      <h2 id="result-title"><span>GH₵</span> {{ money(taxResult.netIncome) }}</h2>
      <p>per month, after PAYE and employee pension</p>
    </div>
    <div class="deductions">
      <h3>Your monthly deductions</h3>
      <dl><div><dt>PAYE income tax</dt><dd>GH₵ {{ money(taxResult.incomeTax) }}</dd></div><div><dt>Employee pension <span>(SSNIT)</span></dt><dd>GH₵ {{ money(taxResult.ssnit) }}</dd></div></dl>
      <button type="button" class="breakdown-button" :aria-expanded="showDetails" aria-controls="tax-breakdown" @click="showDetails = !showDetails">{{ showDetails ? "Hide tax breakdown" : "Explore tax breakdown" }} <span aria-hidden="true">{{ showDetails ? "−" : "+" }}</span></button>
      <div id="tax-breakdown" v-show="showDetails" class="table-scroll">
        <table><caption>Monthly PAYE by tax band</caption><thead><tr><th scope="col">Amount taxed</th><th scope="col">Rate</th><th scope="col">Tax (GH₵)</th></tr></thead><tbody><tr v-for="(band, index) in taxResult.computationBreakdown" :key="index"><td>{{ money(band.amountTaxed) }}</td><td>{{ band.taxRate }}%</td><td>{{ money(band.taxAmount) }}</td></tr></tbody><tfoot><tr><th scope="row" colspan="2">Total PAYE</th><td>{{ money(taxResult.incomeTax) }}</td></tr></tfoot></table>
      </div>
    </div>
  </section>
</template>
