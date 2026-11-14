<script setup>
defineProps({ modelValue: [String, Number], label: String, id: String, hint: String });
defineEmits(["update:modelValue"]);
</script>
<template>
  <div class="form-field">
    <label :for="id">{{ label }}</label>
    <div class="amount-input"><span aria-hidden="true">GH₵</span><input :id="id" type="text" inputmode="decimal" placeholder="0.00" autocomplete="off" spellcheck="false" :aria-describedby="id + '-hint'" :value="modelValue" @input="$emit('update:modelValue', $event.target.value)" /></div>
    <p :id="id + '-hint'" class="field-hint">{{ hint }}</p>
  </div>
</template>
