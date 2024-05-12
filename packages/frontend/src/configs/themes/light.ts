import variables from '@/sass/common/_variables.module.scss'
import { ThemeConfig } from 'antd'
import { Poppins, Roboto } from 'next/font/google'
const { mainColor, light, dark, subColor, subColor2, errorColor } = variables

const poppinsFont = Poppins({
  subsets: ['latin'],
  weight: ['100', '300', '400', '500', '700', '900']
})

export const themConfig: ThemeConfig = {
  token: {
    // Seed Token
    colorPrimary: mainColor,
    colorText: dark,
    colorError: errorColor,
    fontSize: 14,
    fontFamily: 'Poppins, sans-serif',

    // Alias Token
    colorBgContainer: light
  },
  components: {
    Menu: {
      itemSelectedBg: mainColor,
      itemSelectedColor: light
    },
    Table: {
      headerBg: subColor
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
