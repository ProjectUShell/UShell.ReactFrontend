/** @type {import('tailwindcss').Config} */
modern = true;
hue = 255;
sat = 5;
satDark = 5;

lightCurve = [0, 1, 2, 3, 4, 5, 7, 9, 11, 13, 15, 18, 21, 24];
lightCurveDark = [0, 1, 2, 3, 4, 5, 7, 9, 11, 13, 15, 18, 21, 24];
ligthCurveWeight = 1.2;
ligthCurveWeightDark = 1.0;
satCurve = [0, 1, 2, 3, 4, 5, 7, 9, 11, 13, 15, 18, 21, 24];
satCurveDark = [0, 1, 2, 3, 4, 5, 7, 9, 11, 13, 15, 18, 21, 24];

function getBg(i, d) {
  if (d) {
    light =
      lightCurveDark[lightCurveDark.length - 1] * ligthCurveWeightDark -
      lightCurveDark[i] * ligthCurveWeightDark;
    maxSatStep = satCurveDark[satCurveDark.length - 1];
    s = satDark - (satCurveDark[i] / maxSatStep) * satDark;
    return "hsl(" + hue + " " + s + " " + light + ")";
  } else {
    light = 100 - lightCurve[i] * ligthCurveWeight;
    maxSatStep = satCurve[satCurve.length - 1];
    s = sat - (satCurve[i] / maxSatStep) * sat;

    return "hsl(" + hue + " " + s + " " + light + ")";
  }
}

module.exports = {
  mode: "jit",
  darkMode: "class",
  content: [
    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/**/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        supercool: { 50: "#d2bab0" },
        primary: "rgb(var(--color-primary) / <alpha-value>)",
        secondary: "rgb(var(--color-secondary) / <alpha-value>)",
        backgroundone: "rgb(var(--color-background-one) / <alpha-value>)",
        backgroundtwo: "rgb(var(--color-background-two) / <alpha-value>)",
        backgroundthree: "rgb(var(--color-background-three) / <alpha-value>)",
        backgroundfour: "rgb(var(--color-background-four) / <alpha-value>)",
        texttest: "#d2bab0",
        textone: "rgb(var(--color-text-one) / <alpha-value>)",
        texttwo: "rgb(var(--color-text-two) / <alpha-value>)",
        backgroundonedark:
          "rgb(var(--color-background-one-dark) / <alpha-value>)",
        backgroundtwodark:
          "rgb(var(--color-background-two-dark) / <alpha-value>)",
        backgroundthreedark:
          "rgb(var(--color-background-three-dark) / <alpha-value>)",
        backgroundfourdark:
          "rgb(var(--color-background-four-dark) / <alpha-value>)",
        textonedark: "rgb(var(--color-text-one-dark) / <alpha-value>)",
        texttwodark: "rgb(var(--color-text-two-dark) / <alpha-value>)",
        accent: "rgb(var(--color-accent) / <alpha-value>)",
        bg1: getBg(0),
        bg2: getBg(1),
        bg3: getBg(2),
        bg4: getBg(3),
        bg5: getBg(4),
        bg6: getBg(5),
        bg7: getBg(6),
        bg8: getBg(7),
        bg9: getBg(8),
        bg10: getBg(9),
        bg11: getBg(10),
        bg12: getBg(11),
        bg13: getBg(12),
        bg14: getBg(13),
        bg1dark: getBg(0, 1),
        bg2dark: getBg(1, 1),
        bg3dark: getBg(2, 1),
        bg4dark: getBg(3, 1),
        bg5dark: getBg(4, 1),
        bg6dark: getBg(5, 1),
        bg7dark: getBg(6, 1),
        bg8dark: getBg(7, 1),
        bg9dark: getBg(8, 1),
        bg10dark: getBg(9, 1),
        prim1: "var(--color-prim-100)",
        prim2: "var(--color-prim-200)",
        prim3: "var(--color-prim-300)",
        prim4: "var(--color-prim-400)",
        prim5: "var(--color-prim-500)",
        prim6: "var(--color-prim-600)",
        content: modern ? getBg(0) : getBg(0),
        contentBorder: modern ? getBg(8) : getBg(8),
        topbar: modern ? getBg(5) : getBg(8),
        topbarshadow: modern ? getBg(0) : getBg(0),
        menu: modern ? getBg(5) : getBg(6),
        menuHover: modern ? getBg(2) : getBg(1),
        menuBorder: modern ? getBg(8) : getBg(9),
        menu1: modern ? getBg(4) : getBg(1),
        menuHover1: modern ? getBg(0) : getBg(4),
        tabBg: modern ? getBg(0) : getBg(0),
        tab: modern ? getBg(2) : getBg(2),
        tabHover: modern ? getBg(7) : getBg(7),
        tabBorder: modern ? getBg(8) : getBg(8),
        tabSelected: modern ? getBg(4) : getBg(4),
        navigation: modern ? getBg(5) : getBg(4),
        navigationHover: modern ? getBg(8) : getBg(6),
        navigationBorder: modern ? getBg(8) : getBg(8),
        breadcrumb: modern ? getBg(5) : getBg(4),
        breadcrumbHover: modern ? getBg(7) : getBg(8),
        breadcrumbBorder: modern ? getBg(8) : getBg(8),
        toolbar: modern ? getBg(0) : getBg(4),
        toolbarBorder: modern ? getBg(6) : getBg(2),
        toolbarHover: modern ? getBg(4) : getBg(8),
        table: modern ? getBg(0) : getBg(0),
        tableSelected: modern ? getBg(0) : getBg(0),
        tableHover: modern ? getBg(4) : getBg(4),
        tableHead: modern ? getBg(2) : getBg(2),
        hoverItem: modern ? getBg(0) : getBg(0),
        contentDark: modern ? getBg(0, 1) : getBg(0, 1),
        contentBorderDark: modern ? getBg(0, 1) : getBg(0, 1),
        topbarDark: modern ? getBg(6, 1) : getBg(8, 1),
        topbarshadowDark: modern ? getBg(0, 1) : getBg(0, 1),
        topbarBorderDark: modern ? getBg(12, 1) : getBg(12, 1),
        menuDark: modern ? getBg(6, 1) : getBg(6, 1),
        menuHoverDark: modern ? getBg(1, 1) : getBg(1, 1),
        menuBorderDark: modern ? getBg(9, 1) : getBg(9, 1),
        menu1Dark: modern ? getBg(4, 1) : getBg(1, 1),
        menuHover1Dark: modern ? getBg(0, 1) : getBg(4, 1),
        tabBgDark: modern ? getBg(0, 1) : getBg(0, 1),
        tabDark: modern ? getBg(2, 1) : getBg(2, 1),
        tabHoverDark: modern ? getBg(7, 1) : getBg(7, 1),
        tabBorderDark: modern ? getBg(8, 1) : getBg(8, 1),
        tabSelectedDark: modern ? getBg(6, 1) : getBg(4, 1),
        navigationDark: modern ? getBg(6, 1) : getBg(4, 1),
        navigationHoverDark: modern ? getBg(8, 1) : getBg(6, 1),
        navigationBorderDark: modern ? getBg(8, 1) : getBg(8, 1),
        breadcrumbDark: modern ? getBg(6, 1) : getBg(4, 1),
        breadcrumbHoverDark: modern ? getBg(3, 1) : getBg(8, 1),
        breadcrumbBorderDark: modern ? getBg(8, 1) : getBg(8, 1),
        toolbarDark: modern ? getBg(0, 1) : getBg(4, 1),
        toolbarBorderDark: modern ? getBg(6, 1) : getBg(2, 1),
        toolbarHoverDark: modern ? getBg(4, 1) : getBg(8, 1),
        tableDark: modern ? getBg(0, 1) : getBg(0, 1),
        tableSelectedDark: modern ? getBg(0, 1) : getBg(0, 1),
        tableHoverDark: modern ? getBg(4, 1) : getBg(4, 1),
        tableHeadDark: modern ? getBg(2, 1) : getBg(2, 1),
        hoverItemDark: modern ? getBg(0, 1) : getBg(0, 1),
        selectedItemDark: modern ? getBg(0, 1) : getBg(0, 1),
        hairlineMenuDark: modern ? getBg(0, 1) : getBg(0, 1),
        hairlineNavigationDark: modern ? getBg(0, 1) : getBg(0, 1),
      },
    },
    fontFamily: {
      // 'custom': ["rubik"]
    },
  },
  plugins: [],
};
