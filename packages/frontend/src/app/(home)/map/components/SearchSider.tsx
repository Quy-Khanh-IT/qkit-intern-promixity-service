'use client'
import Sider from 'antd/es/layout/Sider'
import './search-sider.scss'
import { Spin, Tooltip } from 'antd'
import { SearchList } from './SearchList'
import { ISearchSider } from '@/types/map'

export default function SearchSider(props: ISearchSider): React.ReactNode {
  const searchResultTooltip = (): React.ReactNode => {
    return (
      <div className='tooltip-wrapper p-2'>
        <div className='tooltip-title mb-2'>About these results</div>
        <div className='tooltip-detail '>
          When you search for businesses or places near a location, Proximity will show you local results. Several
          factors - primarily relevance, distance, and prominence - are combined to help find the best results for your
          search.
        </div>
      </div>
    )
  }

  return (
    <div>
      <Sider
        trigger={null}
        className=' h-100 search-sider '
        collapsible
        collapsed={props.collapsed}
        collapsedWidth={0}
        width={550}
      >
        {props.showSpinner ? (
          <div className='d-flex justify-content-center align-items-center h-100'>
            <Spin size='large' />
          </div>
        ) : (
          <div className='search-result-wrapper w-100 h-100 search-result-wrapper scroll-bar-2 pt-2'>
            <div className='search-result-title mt-2 d-flex justify-content-between align-items-center'>
              <div className='ms-2'>
                Results{' '}
                <Tooltip color='#fff' placement='bottomLeft' title={searchResultTooltip}>
                  <i className='fa-light fa-circle-info'></i>{' '}
                </Tooltip>
                <span className='total-results ms-1'>{props.totalResult ? `(${props.totalResult} results)` : ''}</span>
              </div>
              <div onClick={props.onClose} className='close-btn me-2'>
                <i className='fa-solid fa-x'></i>
              </div>
            </div>
            <div className='search-result-content mt-3'>
              <SearchList businesses={props.businesses} />
            </div>
          </div>
        )}
      </Sider>
    </div>
  )
}
