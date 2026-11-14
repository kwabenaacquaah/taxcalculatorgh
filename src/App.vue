<script setup>
import Banner from "./components/TopBanner.vue";
import SocialShare from "./components/SocialShare.vue";
import { useHead } from "@unhead/vue";
// import InputForm from "@/components/InputForm.vue";
import ResultSection from "@/components/ResultSection.vue";
import { calculate } from "@/lib/core";
import { computed, ref } from "vue";
import FormInput from "@/components/FormInput.vue";
import { monthlyTaxRates } from "@/lib/rates";
import { formatLongDate } from "@/lib/dates";

useHead({
  title: "Tax Calculator Ghana 🇬🇭",
  meta: [
    {
      name: "description",
      content:
        "This tool helps compute your take-home income, income tax and SSNIT contribution based on your gross income."
    }
  ]
});

const grossIncome = ref("");
const taxRelief = ref("");
const allowances = ref("");
const ratesEffectiveFrom = formatLongDate(monthlyTaxRates.effectiveFrom);

// a computed ref
const taxResult = computed(() => {
  return calculate(grossIncome.value, allowances.value, taxRelief.value);
});

</script>

<template>
  <div class="font-sans text-gray-700">
    <section id="container" class="max-w-md m-auto">
      <Banner />
      <div class="border-2 rounded-sm p-4 bg-white">
        <h2 class="text-3xl text-center my-2">Tax Calculator 🇬🇭</h2>
        <p class="text-center mt-6">
          Monthly estimate for resident employees. Compute your <span class="font-medium">net income</span>,
          <a target="_blank" href="https://gra.gov.gh/domestic-tax/tax-types/paye/">PAYE</a> <span class="font-medium">income
          tax</span> and <span class="font-medium">SSNIT deduction</span>.
        </p>

        <form v-cloak @submit.prevent class="px-4 py-4">
          <FormInput class="mt-3" id="gross-income" label="Monthly basic income" v-model="grossIncome"/>
          <FormInput class="mt-3" id="allowances" label="Monthly allowances*" v-model="allowances"/>
          <FormInput class="mt-3" id="tax-relief" label="Monthly tax relief" v-model="taxRelief"/>
          <p class="mt-3 text-sm">Enter the monthly equivalent of your approved tax relief. Leave blank if none applies.</p>
        </form>

        <div class="my-2 text-center text-red-400" role="alert" v-if="taxResult.errorMessage">{{ taxResult.errorMessage }}</div>

        <ResultSection :tax-result="taxResult" v-else />

        <div class="mt-4">* Allowances are also taxed. Bonuses and non-resident income require separate treatment.</div>
      </div>
    </section>
    <div class="text-center" style="margin: 2rem 0">Tax rates effective from {{ ratesEffectiveFrom }}</div>
    <hr />
    <footer class="text-gray-600 px-2">
      <div class="text-center mt-4">
        Disclaimer: We do our best to ensure the accuracy of this tool but we cannot be held
        responsible for any errors.
      </div>
      <div class="text-center mt-4">
        Send <strong>feedback</strong> and suggestions to
        <a class="underline underline-offset-2" target="_blank" href="https://github.com/kwabenaacquaah/taxcalculatorgh/issues"
        >our GitHub issues page</a
        >
      </div>

      <SocialShare />

    </footer>
  </div>
</template>
