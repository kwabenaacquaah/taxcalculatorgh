import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import PayslipSection from "../PayslipSection.vue";
import { calculate } from "../../lib/core";

const props = {
  taxResult: calculate("5000", "1000", "200"),
  basicIncome: "5000", allowances: "1000", taxRelief: "200"
};
describe("payslip preview", () => {
  it("shows the calculator totals and updates when earnings change", async () => {
    const wrapper = mount(PayslipSection, { props });
    expect(wrapper.find(".slip-net").text()).toContain("4,739.25");
    expect(wrapper.find(".slip-table").text()).toContain("6,000.00");
    await wrapper.setProps({ basicIncome: "100000", allowances: "", taxRelief: "", taxResult: calculate("100000", "", "") });
    expect(wrapper.find(".slip-net").text()).toContain("66,412.15");
  });
  it("prints only after names, a supported period and valid earnings are provided", async () => {
    const print = vi.spyOn(window, "print").mockImplementation(() => {});
    try {
      const wrapper = mount(PayslipSection, { props });
      await wrapper.find("form").trigger("submit");
      expect(print).not.toHaveBeenCalled();
      await wrapper.find("#employer-name").setValue("Example Ltd");
      await wrapper.find("#employee-name").setValue("Example Employee");
      await wrapper.find("#pay-month").setValue("2026-08");
      await wrapper.find("form").trigger("submit");
      expect(print).not.toHaveBeenCalled();
      await wrapper.find("#pay-month").setValue("2026-11");
      await wrapper.find("form").trigger("submit");
      expect(print).toHaveBeenCalledOnce();
    } finally {
      print.mockRestore();
    }
  });
  it("hides the payslip when calculation inputs are invalid", () => {
    const wrapper = mount(PayslipSection, { props: { ...props, taxResult: calculate("abc", "", "") } });
    expect(wrapper.find("#payslip-document").exists()).toBe(false);
    expect(wrapper.find('[role="alert"]').exists()).toBe(true);
  });
});
