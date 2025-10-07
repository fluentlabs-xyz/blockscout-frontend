import { defaultsDeep } from 'es-toolkit/compat';

import config from 'configs/app';

const DEFAULT_THEME_COLORS = {
  bg: {
    primary: {
      // for some reason links to colors.white and colors.black variables are not working here
      // so we use hex values instead
      // but it is not the case for other colors
      _light: { value: '#FFFFFF' }, // colors.white
      _dark: { value: '#ffffff1a' }, // colors.black
    },
  },
  text: {
    primary: {
      _light: { value: '{colors.blackAlpha.800}' },
      _dark: { value: 'rgba(255, 255, 255, 1)' },
    },
    secondary: {
      _light: { value: '{colors.gray.500}' },
      _dark: { value: 'rgba(255, 255, 255, 0.50)' },
    },
  },
  hover: {
    _light: { value: '{colors.blue.400}' },
    _dark: { value: '{colors.cyan.200}' },
  },
  selected: {
    control: {
      text: {
        _light: { value: '{colors.blue.700}' },
        _dark: { value: '{colors.gray.50}' },
      },
      bg: {
        _light: { value: '{colors.blue.50}' },
        _dark: { value: '{colors.whiteAlpha.100}' },
      },
    },
    option: {
      bg: {
        _light: { value: '{colors.blue.500}' },
        _dark: { value: '{colors.blue.500}' },
      },
    },
  },
  icon: {
    primary: {
      _light: { value: '{colors.gray.500}' },
      _dark: { value: '{colors.grey.30}' },
    },
    secondary: {
      _light: { value: '{colors.gray.400}' },
      _dark: { value: '{colors.grey.30}' },
    },
  },
  button: {
    primary: {
      _light: { value: '{colors.blue.600}' },
      _dark: { value: '{colors.white}' },
    },
  },
  link: {
    primary: {
      _light: { value: '{colors.blue.600}' },
      _dark: { value: '{colors.white}' },
    },
  },
  graph: {
    line: {
      _light: { value: '{colors.blue.500}' },
      _dark: { value: '{colors.blue.200}' },
    },
    gradient: {
      start: {
        _light: { value: 'rgba(144, 205, 244, 0.3)' }, // blue.200 with opacity 0.3
        _dark: { value: 'rgba(144, 205, 244, 0.3)' }, // blue.200 with opacity 0.3
      },
      stop: {
        _light: { value: 'rgba(144, 205, 244, 0)' }, // blue.200 with opacity 0
        _dark: { value: 'rgba(144, 205, 244, 0)' }, // blue.200 with opacity 0
      },
    },
  },
  navigation: {
    bg: {
      selected: {
        _light: { value: '{colors.blue.50}' },
        _dark: { value: '#ffffff1a' },
      },
    },
    text: {
      selected: {
        _light: { value: '{colors.blue.700}' },
        _dark: { value: '{colors.gray.50}' },
      },
    },
  },
  stats: {
    bg: {
      _light: { value: '{colors.gray.50}' },
      _dark: { value: '{colors.whiteAlpha.900}' },
    },
  },
  topbar: {
    bg: {
      _light: { value: '{colors.gray.50}' },
      _dark: { value: '{colors.white}' },
    },
  },
  tabs: {
    text: {
      primary: {
        _light: { value: '{colors.blue.700}' },
        _dark: { value: '{colors.white}' },
      },
    },
  },
};

const colors = {
  // BASE COLORS
  green: {
    '50': { value: '#F0FFF4' },
    '100': { value: '#C6F6D5' },
    '200': { value: '#9AE6B4' },
    '400': { value: '#48BB78' },
    '500': { value: '#38A169' },
    '600': { value: '#25855A' },
    '800': { value: '#22543D' },
    '900': { value: '#1C4532' },
  },
  blue: {
    '50': { value: '#EBF8FF' },
    '100': { value: '#BEE3F8' },
    '200': { value: '#90CDF4' },
    '300': { value: '#63B3ED' },
    '400': { value: '#4299E1' },
    '500': { value: '#3182CE' },
    '600': { value: '#2B6CB0' },
    '700': { value: '#2C5282' },
    '800': { value: '#2A4365' },
    '900': { value: '#1A365D' },
  },
  red: {
    '50': { value: '#FFF5F5' },
    '100': { value: '#FED7D7' },
    '200': { value: '#FEB2B2' },
    '400': { value: '#F56565' },
    '500': { value: '#E53E3E' },
    '600': { value: '#C53030' },
    '800': { value: '#822727' },
    '900': { value: '#63171B' },
  },
  orange: {
    '50': { value: '#FFFAF0' },
    '100': { value: '#FEEBCB' },
    '300': { value: '#F6AD55' },
    '400': { value: '#ED8936' },
    '500': { value: '#DD6B20' },
    '600': { value: '#C05621' },
    '800': { value: '#7B341E' },
    '900': { value: '#652B19' },
  },
  yellow: {
    '100': { value: '#FEFCBF' },
    '300': { value: '#F6E05E' },
    '400': { value: '#ECC94B' },
    '500': { value: '#D69E2E' },
    '600': { value: '#B7791F' },
    '800': { value: '#744210' },
    '900': { value: '#5F370E' },
  },
  grey: {
    '10': { value: 'rgba(255, 255, 255, 0.10)' },
    '20': { value: 'rgba(255, 255, 255, 0.20)' },
    '30': { value: 'rgba(255, 255, 255, 0.30)' },
    '50': { value: 'rgba(255, 255, 255, 0.50)' },
  },
  gray: {
    '50': { value: '#F7FAFC' },
    '100': { value: '#EDF2F7' },
    '200': { value: '#E2E8F0' },
    '300': { value: '#CBD5E0' },
    '400': { value: '#A0AEC0' },
    '500': { value: '#718096' },
    '600': { value: '#4A5568' },
    '700': { value: '#2D3748' },
    '800': { value: '#1A202C' },
    '900': { value: '#171923' },
  },
  teal: {
    '50': { value: '#E6FFFA' },
    '100': { value: '#B2F5EA' },
    '500': { value: '#319795' },
    '800': { value: '#234E52' },
  },
  cyan: {
    '50': { value: '#EDFDFD' },
    '100': { value: '#C4F1F9' },
    '200': { value: 'rgba(74, 237, 237, 1)' },
    '500': { value: '#00B5D8' },
    '800': { value: '#086F83' },
  },
  purple: {
    '50': { value: '#FAF5FF' },
    '100': { value: '#E9D8FD' },
    '400': { value: '#9F7AEA' },
    '500': { value: '#805AD5' },
    '600': { value: '#6B46C1' },
    '800': { value: '#44337A' },
  },
  black: { value: '#000000' },
  white: { value: '#ffffff' },
  whiteAlpha: {
    '50': { value: 'RGBA(255, 255, 255, 0.04)' },
    '100': { value: 'RGBA(255, 255, 255, 0.06)' },
    '200': { value: 'RGBA(255, 255, 255, 0.08)' },
    '300': { value: 'RGBA(255, 255, 255, 0.16)' },
    '400': { value: 'RGBA(255, 255, 255, 0.24)' },
    '500': { value: 'RGBA(255, 255, 255, 0.36)' },
    '600': { value: 'RGBA(255, 255, 255, 0.48)' },
    '700': { value: 'RGBA(255, 255, 255, 0.64)' },
    '800': { value: 'RGBA(255, 255, 255, 0.80)' },
    '900': { value: 'RGBA(255, 255, 255, 0.92)' },
  },
  blackAlpha: {
    '50': { value: 'RGBA(16, 17, 18, 0.04)' },
    '100': { value: 'RGBA(16, 17, 18, 0.06)' },
    '200': { value: 'RGBA(16, 17, 18, 0.08)' },
    '300': { value: 'RGBA(16, 17, 18, 0.16)' },
    '400': { value: 'RGBA(16, 17, 18, 0.24)' },
    '500': { value: 'RGBA(16, 17, 18, 0.36)' },
    '600': { value: 'RGBA(16, 17, 18, 0.48)' },
    '700': { value: 'RGBA(16, 17, 18, 0.64)' },
    '800': { value: 'RGBA(16, 17, 18, 0.80)' },
    '900': { value: 'RGBA(16, 17, 18, 0.92)' },
  },

  // BRAND COLORS
  github: { value: '#171923' },
  telegram: { value: '#2775CA' },
  linkedin: { value: '#1564BA' },
  discord: { value: '#9747FF' },
  slack: { value: '#1BA27A' },
  twitter: { value: '#000000' },
  opensea: { value: '#2081E2' },
  facebook: { value: '#4460A0' },
  medium: { value: '#231F20' },
  reddit: { value: '#FF4500' },
  celo: { value: '#FCFF52' },
  clusters: { value: '#DE6061' },

  // THEME COLORS
  theme: defaultsDeep(config.UI.colorTheme.overrides, DEFAULT_THEME_COLORS),
};

export default colors;
