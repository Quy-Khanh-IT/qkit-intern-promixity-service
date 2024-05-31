import './auth.scss'
import { Poppins } from 'next/font/google'

const popin = Poppins({
  subsets: ['latin'],
  weight: ['100', '300', '400', '500', '600', '700', '800', '900']
})
export default function AuthLayout({ children }: Readonly<{ children: React.ReactNode }>): React.ReactNode {
  return <div className={popin.className}>{children}</div>
}
