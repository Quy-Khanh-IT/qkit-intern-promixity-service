import variables from '@/sass/common/_variables.module.scss'
import { ThemeConfig } from 'antd'
const { mainColor, light, dark, subColor, subColor2, grayRowHover, errorColor } = variables

export const themConfig: ThemeConfig = {
  token: {
    colorPrimary: mainColor,
    colorText: dark,
    colorError: errorColor,
    fontSize: 16,
    fontFamily: 'Nunito, sans-serif',

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
