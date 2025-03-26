modern = false;
hue = 200;
sat = 5;
satDark = 10;

primaryColorHue = 225;
lightDirection = 1;
darkBordersDark = false;
lightCurve = [
  0, 1, 2, 3, 4, 5, 7, 9, 11, 13, 15, 18, 21, 24, 27, 30, 33, 36, 39, 42, 45,
  48, 51, 54, 57, 60, 63, 66, 69, 72, 75, 78, 81, 84, 87, 90, 93, 96, 99, 100,
];
lightCurveDark = [
  0, 3, 6, 9, 11, 13, 15, 17, 19, 20, 21, 22, 23, 24, 25, 26, 27,
];
lightCurveDark2 = [
  0, 3, 6, 9, 11, 13, 15, 17, 19, 20, 21, 22, 23, 24,
].reverse();

ligthCurveWeight = 1.2;
ligthCurveWeightDark = 0.25;
ligthCurveWeightDark2 = 0.6;
satCurve = [0, 1, 2, 3, 4, 5, 7, 9, 11, 13, 15, 18, 21, 24];
satCurveDark = [0, 1, 2, 3, 4, 5, 7, 9, 11, 13, 15, 18, 21, 24];

function getBorder(i, d) {
  light = getLight(i + 2, d);
  light = light + (d ? 10 : -5);
  sat = getSat(i, d);
  return "hsl(" + hue + ", " + s + "%, " + light + "%)";
}

function getHover(i, d) {
  light = getLight(i + 2, d);
  light = light + (d ? 12 : -10);
  sat = getSat(i, d);
  return "hsl(" + hue + ", " + s + "%, " + light + "%)";
}

function getSelected(i, d) {
  light = getLight(i + 2, d);
  light = light + (d ? 7 : -5);
  sat = getSat(i, d);
  return "hsl(" + hue + ", " + s + "%, " + light + "%)";
}

function getBg(i, d) {
  light = getLight(i, d);
  s = getSat(i, d);
  return "hsl(" + hue + ", " + s + "%, " + light + "%)";
}

function getLight(i, d) {
  if (d) {
    if (lightDirection === 1) {
      light = 3 + lightCurveDark2[i] * ligthCurveWeightDark2;
    } else {
      light = 12 + lightCurveDark[i] * ligthCurveWeightDark;
    }
    return light;
  } else {
    light = 100 - lightCurve[i] * ligthCurveWeight;
    return light;
  }
}

function getSat(i, d) {
  if (d) {
    maxSatStep = satCurveDark[satCurveDark.length - 1];
    s = satDark - (satCurveDark[i] / maxSatStep) * satDark;
    return s;
  } else {
    maxSatStep = satCurve[satCurve.length - 1];
    s = sat - (satCurve[i] / maxSatStep) * sat;

    return s;
  }
}

function getPrimaryColor(i, d) {
  if (d) return getPrimaryColorDark(i);
  primaryLight = 93 - i * 4;
  primarySat = 100 - i * 6;
  return (
    "hsl(" + primaryColorHue + "," + primarySat + "%," + primaryLight + "%)"
  );
}

function getPrimaryColorDark(i) {
  primaryLight = 25 + i * 5;
  primarySat = 80 + i * 2;
  return (
    "hsl(" + primaryColorHue + "," + primarySat + "%," + primaryLight + "%)"
  );
}

module.exports = {
  darkMode: "class",
  content: [
    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/**/**/*.{js,ts,jsx,tsx}",
    "./src/**/**/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Add your custom colors here
        customRed: "#FF0000",
        customBlue: "#0000FF",
        primary2: "var(--color-primary)",
        primary: "rgb(var(--color-primary))",
        secondary: "rgb(var(--color-secondary))",
        texttest: "#d2bab0",
        textone: "var(--color-text-one)",
        texttwo: "var(--color-text-two)",
        text3: "#0000FF",
        backgroundone: "rgb(var(--color-background-one))",
        backgroundtwo: "rgb(var(--color-background-two))",
        backgroundthree: "rgb(var(--color-background-three))",
        backgroundfour: "rgb(var(--color-background-four))",
        backgroundonedark: "var(--color-background-one-dark)",
        backgroundtwodark: "var(--color-background-two-dark)",
        backgroundthreedark: "var(--color-background-three-dark)",
        backgroundfourdark: "var(--color-background-four-dark)",
        textonedark: "var(--color-text-one-dark)",
        texttwodark: "var(--color-text-two-dark)",
        accent: "rgb(var(--color-accent))",
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
        // prim1: 'var(--color-prim-100)',
        // prim2: 'var(--color-prim-200)',
        // prim3: 'var(--color-prim-300)',
        // prim4: 'var(--color-prim-400)',
        // prim5: 'var(--color-prim-500)',
        // prim6: 'var(--color-prim-600)',
        prim1: getPrimaryColor(0),
        prim2: getPrimaryColor(1),
        prim3: getPrimaryColor(2),
        prim4: getPrimaryColor(3),
        prim5: getPrimaryColor(4),
        prim6: getPrimaryColor(5),
        prim7: getPrimaryColor(6),
        prim8: getPrimaryColor(7),
        prim9: getPrimaryColor(8),
        prim10: getPrimaryColor(9),
        prim11: getPrimaryColor(10),
        prim1Dark: getPrimaryColor(0, 1),
        prim2Dark: getPrimaryColor(1, 1),
        prim3Dark: getPrimaryColor(2, 1),
        prim4Dark: getPrimaryColor(3, 1),
        prim5Dark: getPrimaryColor(4, 1),
        prim6Dark: getPrimaryColor(5, 1),
        prim7Dark: getPrimaryColor(6, 1),
        prim8Dark: getPrimaryColor(7, 1),
        prim9Dark: getPrimaryColor(8, 1),
        prim10Dark: getPrimaryColor(9, 1),
        prim11Dark: getPrimaryColor(10, 1),
        content: modern ? getBg(0) : getBg(0),
        contentSelected: modern ? getSelected(0) : getSelected(0),
        contentBorder: modern ? getBorder(0) : getBorder(0),
        contentHover: modern ? getHover(0) : getHover(0),
        editor: getBg(3),
        editorBorder: getBorder(3),
        editorHover: getHover(3),
        topbar: modern ? getBg(5) : getBg(8),
        topbarHover: modern ? getHover(5) : getHover(8),
        topbarshadow: modern ? getBg(0) : getBg(0),
        menu: modern ? getBg(5) : getBg(6),
        menuHover: modern ? getHover(5) : getHover(6),
        menuBorder: modern ? getBorder(5) : getBorder(6),
        menu1: modern ? getBg(4) : getBg(1),
        menuHover1: modern ? getBg(0) : getBg(4),
        tabBg: modern ? getBg(0) : getBg(0),
        tab: modern ? getBg(2) : getBg(2),
        tabHover: modern ? getHover(2) : getHover(2),
        tabBorder: modern ? getBorder(2) : getBorder(2),
        tabSelected: modern ? getBg(4) : getBg(4),
        navigation: modern ? getBg(5) : getBg(4),
        navigationHover: modern ? getHover(5) : getHover(4),
        navigationSelected: modern ? getSelected(5) : getSelected(4),
        navigationBorder: modern ? getBorder(5) : getBorder(4),
        breadcrumb: modern ? getBg(5) : getBg(4),
        breadcrumbHover: modern ? getHover(5) : getHover(4),
        breadcrumbBorder: modern ? getBorder(5) : getBorder(4),
        toolbar: modern ? getBg(0) : getBg(4),
        toolbarBorder: modern ? getBorder(0) : getBorder(4),
        toolbarHover: modern ? getHover(0) : getHover(4),
        table: modern ? getBg(0) : getBg(0),
        tableSelected: modern ? getBg(0) : getBg(0),
        tableHover: modern ? getHover(0) : getHover(0),
        tableHead: modern ? getBg(2) : getBg(2),
        tableBorder: modern ? getBorder(0) : getBorder(0),
        hoverItem: modern ? getBg(0) : getBg(0),
        contentDark: modern ? getBg(0, 1) : getBg(0, 1),
        contentSelectedDark: modern ? getSelected(0, 1) : getSelected(0, 1),
        contentBorderDark: getBorder(0, 1),
        contentHoverDark: modern ? getHover(0, 1) : getHover(0, 1),
        editorDark: getBg(3, 1),
        editorBorderDark: getBorder(3, 1),
        editorHoverDark: getHover(3, 1),
        topbarDark: modern ? getBg(6, 1) : getBg(8, 1),
        topbarHoverDark: modern ? getHover(6, 1) : getHover(8, 1),
        topbarshadowDark: modern ? getBg(0, 1) : getBg(0, 1),
        topbarBorderDark: modern ? getBorder(6, 1) : getBorder(8, 1),
        menuDark: modern ? getBg(6, 1) : getBg(6, 1),
        menuHoverDark: modern ? getHover(6, 1) : getHover(6, 1),
        menuBorderDark: getBorder(6, 1),
        menu1Dark: modern ? getBg(4, 1) : getBg(1, 1),
        menuHover1Dark: modern ? getBg(0, 1) : getBg(4, 1),
        tabBgDark: modern ? getBg(0, 1) : getBg(0, 1),
        tabDark: modern ? getBg(2, 1) : getBg(2, 1),
        tabHoverDark: modern ? getHover(2, 1) : getHover(2, 1),
        tabBorderDark: modern ? getBorder(2, 1) : getBorder(2, 1),
        tabSelectedDark: modern ? getBg(6, 1) : getBg(4, 1),
        navigationDark: modern ? getBg(6, 1) : getBg(4, 1),
        navigationHoverDark: modern ? getHover(6, 1) : getHover(4, 1),
        navigationSelectedDark: modern ? getSelected(6, 1) : getSelected(4, 1),
        navigationBorderDark: modern ? getBorder(6, 1) : getBorder(4, 1),
        breadcrumbDark: modern ? getBg(6, 1) : getBg(4, 1),
        breadcrumbHoverDark: modern ? getHover(6, 1) : getHover(4, 1),
        breadcrumbBorderDark: modern ? getBorder(6, 1) : getBorder(4, 1),
        toolbarDark: modern ? getBg(0, 1) : getBg(4, 1),
        toolbarBorderDark: modern ? getBorder(0, 1) : getBorder(4, 1),
        toolbarHoverDark: modern ? getHover(1, 1) : getHover(5, 1),
        tableDark: modern ? getBg(0, 1) : getBg(0, 1),
        tableSelectedDark: modern ? getBg(0, 1) : getBg(0, 1),
        tableHoverDark: modern ? getHover(0, 1) : getHover(0, 1),
        tableHeadDark: modern ? getBg(2, 1) : getBg(2, 1),
        tableBorderDark: modern ? getBorder(0, 1) : getBorder(0, 1),
        hoverItemDark: modern ? getBg(0, 1) : getBg(0, 1),
        selectedItemDark: modern ? getBg(0, 1) : getBg(0, 1),
        hairlineMenuDark: modern ? getBg(0, 1) : getBg(0, 1),
        hairlineNavigationDark: modern ? getBg(0, 1) : getBg(0, 1),
        // ...
      },
    },
    fontFamily: {
      sans: ["ui-sans-serif", "system-ui"],
      serif: ["ui-serif", "Georgia"],
      mono: ["ui-monospace", "SFMono-Regular"],
      display: ["Optimistic Text", "ui-sans-serif", "system-ui", "sans-serif"],
    },
  },
  variants: {
    backgroundColor: ({ after }) => after(["disabled"]),
    textColor: ({ after }) => after(["disabled"]),
    extend: {
      width: ["focus"],
      backgroundColor: ["focus"],
      borderColor: ["focus"],
    },
  },
  plugins: [],
};
