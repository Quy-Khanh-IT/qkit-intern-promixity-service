import variables from '@/sass/common/_variables.module.scss'
import { ThemeConfig } from 'antd'
import { Nunito } from 'next/font/google'
const { mainColor, light, dark, subColor, subColor2, grayRowHover, errorColor } = variables

const _nunitoFont = Nunito({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700', '900']
})

export const themConfig: ThemeConfig = {
  token: {
    // Seed Token
    colorPrimary: mainColor,
    colorText: dark,
    colorError: errorColor,
    fontSize: 16,
    fontFamily: 'Nunito, sans-serif',

    // Alias Token
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
  // components: {
  //   Input: {
  //     colorBgContainerDisabled: disabledBackground,
  //     activeShadow: 'none',
  //     colorTextDisabled: '#333'
  //   },
  //   Select: {
  //     boxShadow: 'none',
  //     controlOutlineWidth: 0,
  //     optionSelectedBg: subColor
  //   },
  //   Menu: {
  //     itemSelectedBg: mainColor,
  //     itemSelectedColor: light
  //   },
  //   Table: {
  //     headerBg: subColor
  //   },
  //   List: {
  //     lineWidth: 0
  //   },
  //   Button: {
  //     primaryShadow: 'none'
  //   },
  //   Image: {},
  //   Typography: {}
  // }
}
