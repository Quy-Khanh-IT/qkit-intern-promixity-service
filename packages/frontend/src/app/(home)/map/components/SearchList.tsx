import { IBusiness } from '@/types/business'
import './search-list.scss'
import SearchItem from './SearchItem'

export function SearchList({
  businesses,
  handleItemClick,
  handleChangeFetch
}: {
  businesses: IBusiness[] | [] | undefined
  handleItemClick: () => void
  handleChangeFetch: (value: boolean) => void
}): React.ReactNode {
  return (
    <div className='search-list-wrapper'>
      {businesses && businesses.length > 0 ? (
        businesses.map((business) => {
          return (
            <div key={business.id}>
              <SearchItem handleChangeFetch={handleChangeFetch} handleItemClick={handleItemClick} business={business} />
            </div>
          )
        })
      ) : (
        <div className='not-found-wrapper container'>
          <div className='not-found-title mb-2'>Proximity Service can&apos;t find any business in your area.</div>
          <div>Make sure your search is spelled correctly. Try adding a city, state, or more detail information.</div>
          <div className='mt-3'>Should this place be on Proximity Service?</div>
          <div className='linking-content'>Adding a missing business</div>
        </div>
      )}
    </div>
  )
}
