<script setup>
import { computed, ref } from "vue";
import { Decimal } from "decimal.js";
const props = defineProps({ taxResult: { type: Object, required: true } });
const deductions = computed(() => new Decimal(props.taxResult.incomeTax).plus(props.taxResult.ssnit).toFixed(2));
const gross = computed(() => new Decimal(props.taxResult.netIncome).plus(deductions.value).toFixed(2));
const showDetails = ref(false);
const formatter = new Intl.NumberFormat("en-GH", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const money = (value) => formatter.format(Number(value));
</script>
<template>
  <section class="results-card" aria-labelledby="result-title">
    <div class="take-home" aria-live="polite" aria-atomic="true">
      <p class="eyebrow">Employee take-home pay</p>
      <h2 id="result-title"><span>GH₵</span> {{ money(taxResult.netIncome) }}</h2>
      <p>Monthly estimate after PAYE and employee pension</p>
      <dl class="summary-totals"><div><dt>Gross earnings</dt><dd>GH₵ {{ money(gross) }}</dd></div><div><dt>Total deductions</dt><dd>GH₵ {{ money(deductions) }}</dd></div></dl>
    </div>
    <div class="deductions">
      <div class="deduction-heading"><h3>Calculation summary</h3><span class="estimate-label">Monthly estimate</span></div>
      <dl><div><dt>PAYE income tax</dt><dd>GH₵ {{ money(taxResult.incomeTax) }}</dd></div><div><dt>Employee pension <span>(SSNIT)</span></dt><dd>GH₵ {{ money(taxResult.ssnit) }}</dd></div></dl>
      <button type="button" class="breakdown-button" :aria-expanded="showDetails" aria-controls="tax-breakdown" @click="showDetails = !showDetails">{{ showDetails ? "Hide tax breakdown" : "Explore tax breakdown" }} <span aria-hidden="true">{{ showDetails ? "−" : "+" }}</span></button>
      <div id="tax-breakdown" v-show="showDetails" class="table-scroll">
        <table><caption>Monthly PAYE by tax band</caption><thead><tr><th scope="col">Amount taxed</th><th scope="col">Rate</th><th scope="col">Tax (GH₵)</th></tr></thead><tbody><tr v-for="(band, index) in taxResult.computationBreakdown" :key="index"><td>{{ money(band.amountTaxed) }}</td><td>{{ band.taxRate }}%</td><td>{{ money(band.taxAmount) }}</td></tr></tbody><tfoot><tr><th scope="row" colspan="2">Total PAYE</th><td>{{ money(taxResult.incomeTax) }}</td></tr></tfoot></table>
      </div>
    </div>
  </section>
</template>
