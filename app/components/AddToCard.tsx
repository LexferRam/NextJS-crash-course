'use client'

import React from 'react'

const AddToCard = () => {
  return (
    <div>
        <button
          className="btn btn-success btn-outline sm:btn-sm md:btn-md lg:btn-lg"
          onClick={() => console.log('click')}
        >
            Add to card
        </button>
    </div>
  )
}

export default AddToCard