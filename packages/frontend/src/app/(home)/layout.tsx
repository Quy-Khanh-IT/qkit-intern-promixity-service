export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>): React.ReactNode {
  return <div>{children}</div>
}
