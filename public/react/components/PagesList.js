import React from 'react'
import { Page } from './Page'

export const PagesList = ({ pages,onArticleClick }) => {
  return <>
		{pages.map((page,index) => (
        <li key={index} onClick={() => onArticleClick(page.slug)}>
          <h3>{page.title}</h3>
		  <p>{page.slug}</p>
        </li>
      ))}
	</>
}
