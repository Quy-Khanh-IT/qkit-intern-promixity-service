'use client'
import Sider from 'antd/es/layout/Sider'
import './search-sider.scss'
import { Button, Dropdown, MenuProps, Space, Spin, Tooltip } from 'antd'
import { SearchList } from './SearchList'
import { ISearchSider } from '@/types/map'
import { RatingMenu } from '@/constants/map'
import { useGetAllBusinessCategoriesQuery } from '@/services/category.service'

export default function SearchSider(props: ISearchSider): React.ReactNode {
  const { data: getCategoryResponse } = useGetAllBusinessCategoriesQuery()

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
  const handleRatingMenuClick: MenuProps['onClick'] = (e) => {
    props.handleOnChangeRating(e.key)
  }
  const starItems: MenuProps['items'] = RatingMenu
  const menuProps = {
    starItems,
    onClick: handleRatingMenuClick
  }

  const categoryItems: MenuProps['items'] =
    getCategoryResponse && getCategoryResponse.filterOpts.length > 0
      ? [
          { label: 'ALL category', key: 'all' },
          ...getCategoryResponse.filterOpts.map((item, index) => ({
            key: item.value,
            label: item.text
          }))
        ]
      : []

  const handleCategoryMenuClick: MenuProps['onClick'] = (e) => {
    props.handleOnChangeCategory(e.key)
  }
  const categoryProps = {
    items: categoryItems,
    onClick: handleCategoryMenuClick
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
                <Dropdown className='ms-2' menu={menuProps}>
                  <Button className='btn-dropdown'>
                    <Space>
                      {props.rating ? `${props.rating} +⭐` : 'Any ⭐'}
                      <i className='fa-solid fa-angle-down'></i>
                    </Space>
                  </Button>
                </Dropdown>
                <Dropdown className='ms-2' menu={categoryProps}>
                  <Button className='btn-dropdown'>
                    <Space className='category-meu-wrapper'>
                      {props.categoryId && props.categoryId !== 'all'
                        ? getCategoryResponse && getCategoryResponse.filterOpts.length > 0
                          ? getCategoryResponse.filterOpts.find((item) => item.value === props.categoryId)?.text
                          : 'ALL category'
                        : 'ALL category'}
                      <i className='fa-solid fa-angle-down'></i>
                    </Space>
                  </Button>
                </Dropdown>
              </div>
              <div onClick={props.onClose} className='close-btn me-2'>
                <i className='fa-solid fa-x'></i>
              </div>
            </div>
            <div className='search-result-content mt-3'>
              <SearchList handleItemClick={props.handleItemClick} businesses={props.businesses} />
            </div>
          </div>
        )}
      </Sider>
    </div>
  )
}
