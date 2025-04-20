import React from 'react'

export default function About({instructor, isExpanded, setIsExpanded}) {
  return (
    <div>
      <div>
        <h2 className="font-medium text-2xl text-[#070707] mt-8 mb-4">
          About Me
        </h2>
        <div className="relative">
          <p
            className={`text-[#4A4C56] text-xl font-normal ${
              !isExpanded && "line-clamp-3"
            }`}
          >
            {instructor.about}
          </p>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-[#20B894] text-sm font-medium hover:text-emerald-700 mt-2"
          >
            {isExpanded ? "Read Less" : "Read More"}
          </button>
        </div>
      </div>
    </div>
  );
}
