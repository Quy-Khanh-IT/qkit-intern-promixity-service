import dynamic from 'next/dynamic'

const AddressLineMap = dynamic(() => import('./AddressLineMap'), {
  ssr: false
})

export default AddressLineMap
