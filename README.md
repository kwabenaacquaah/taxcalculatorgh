# Tax Calculator 🇬🇭
Ghana has a progressive income tax which is not easy to calculate. This tool makes it easier for people to compute their take-home income.

Built with [VueJS](https://vuejs.org) and `TailwindCss`

Fork of [Kessir/taxcalculatorgh](https://github.com/Kessir/taxcalculatorgh).

GitHub Pages address after deployment: https://kwabenaacquaah.github.io/taxcalculatorgh/

Estimates monthly PAYE for resident employees using the September 2026 [GRA rates](https://gra.gov.gh/domestic-tax/tax-types/paye/). Enter approved relief as a monthly amount. Bonuses and non-resident taxation require separate treatment.

The employee pension deduction uses 5.5% of basic income up to the 2026 maximum insurable earnings of GHS 69,000. [SSNIT notice](https://www.ssnit.org.gh/wp-content/uploads/2026/01/Public-Notice-Min-Max-Insurable.pdf). Amounts accept grouped thousands and surrounding whitespace.

Pull requests run lint, unit tests and a production build. Configure GitHub Pages to use GitHub Actions when enabling deployment.

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
