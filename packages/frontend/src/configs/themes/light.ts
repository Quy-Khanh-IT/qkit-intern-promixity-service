import variables from '@/sass/common/_variables.module.scss'
import { ThemeConfig } from 'antd'
const { mainColor, light, dark, subColor, subColor2, grayRowHover, errorColor } = variables

const mainFontFamily = 'Nunito, sans-serif'
export const subFrontFamily = 'Jost, sans-serif'

export const themConfig: ThemeConfig = {
  token: {
    colorPrimary: mainColor,
    colorText: dark,
    colorError: errorColor,
    fontSize: 16,
    fontFamily: mainFontFamily,

    colorBgContainer: light
  },
  components: {
    Menu: {
      itemSelectedBg: mainColor,
      itemSelectedColor: light
    },
    Table: {
      headerBg: subColor,
      rowHoverBg: grayRowHover,
      headerSortActiveBg: subColor,
      headerSortHoverBg: subColor,
      bodySortBg: subColor2
    }
  }
}
