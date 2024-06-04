'use client'
import React, { useState } from 'react'
import './dev-quote.scss'
import { IQuotes } from '@/types/common'

export default function DevQuote(): React.ReactNode {
  const [currentQuoteId, setCurrentQuoteId] = useState<number>(0)

  const quotes: IQuotes[] = [
    {
      content: `'Amidst this vast world, map-search applications serve as gateways to explore the wonders of our planet,
                guiding us from narrow streets to towering mountains. They not only lead us to places but also instill a sense
                of wonder in the art of discovery.'`,
      owner: 'Chính',
      position: 'Full-stack Intern at QKIT Software'
    },
    {
      content: `'First, solve the problem. Then, write the code. Remember, a good programmer writes not just to make things work, 
                but to ensure the code is maintainable and understandable for future developers.'`,
      owner: 'Beo',
      position: 'Full-stuck Intern at QKIT Software'
    },
    {
      content: `'Experience is the name everyone gives to their mistakes. In programming, mistakes are valuable learning opportunities
                that help us become better problem solvers and more experienced developers.'`,
      owner: 'Ngoc',
      position: 'Back-End Intern at QKIT Software'
    },
    {
      content: `'In order to be irreplaceable, one must always be different. This applies to software development as well innovate, 
                create unique solutions, and constantly strive to improve your skills and approach.'`,
      owner: 'Tuấn',
      position: 'Front-End Intern at QKIT Software'
    }
  ]

  const handleOnChangeQuote = (type: string): void => {
    if (type === 'increase') {
      setCurrentQuoteId((prev) => (prev < quotes.length - 1 ? prev + 1 : 0))
    } else {
      setCurrentQuoteId((prev) => (prev > 0 ? prev - 1 : quotes.length - 1))
    }
  }

  return (
    <div className='dev-quote w-100 h-100'>
      <div className='header'></div>
      <div id='quote-container' className='content'>
        <h1>What&apos;s our </h1>
        <h1>Developer Said.</h1>
        <i className='fa-solid fa-quote-left'></i>
        <div className='quote'>{quotes[currentQuoteId].content}</div>
        <div className='quote-owner'>{quotes[currentQuoteId].owner}</div>
        <div style={{ marginTop: '8px' }}>{quotes[currentQuoteId].position}</div>

        <div className='btn-wrapper'>
          <button onClick={() => handleOnChangeQuote('decrease')} className='btn-quote'>
            <i className='fa-solid fa-arrow-left'></i>
          </button>
          <button onClick={() => handleOnChangeQuote('increase')} className='btn-quote'>
            <i className='fa-solid fa-arrow-right'></i>
          </button>
        </div>

        <div className='thumb'>
          <img src='./images/star.png' alt='star' />
        </div>
      </div>
    </div>
  )
}
