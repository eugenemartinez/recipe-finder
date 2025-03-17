import React from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const RecipeInstructions = ({ recipe, showVideo, setShowVideo }) => {
  return (
    <>
      <h2 className="text-2xl font-bold mb-2 text-[#81B29A]">Instructions</h2>
      <p className="text-[#E6DFD9] whitespace-pre-line mb-4">{recipe.instructions}</p>

      {/* Place watch video button right after instructions */}
      {recipe.video && (
        <div className="mb-6 flex justify-center">
          <button
            onClick={() => setShowVideo(!showVideo)}
            className={`px-6 py-3 ${showVideo ? 'bg-[#9D3131]' : 'bg-[#E07A5F]'} 
                      text-[#F4F1DE] rounded font-medium 
                      flex items-center justify-center cursor-pointer
                      transition-all duration-300 
                      hover:-translate-y-0.5 hover:shadow-md
                      active:translate-y-0 active:shadow-sm
                      ${showVideo ? 'hover:bg-[#8C2C2C]' : 'hover:bg-[#D06A4F]'}
                      group`}
          >
            {showVideo ? (
              <>
                <FaEyeSlash className="mr-2 transition-transform duration-300 group-hover:scale-110" />
                Hide Video Tutorial
              </>
            ) : (
              <>
                <FaEye className="mr-2 transition-transform duration-300 group-hover:scale-110" />
                Watch Video Tutorial
              </>
            )}
          </button>
        </div>
      )}

      {showVideo && recipe.video && (
        <div className="mt-4">
          <iframe
            width="100%"
            height="315"
            src={recipe.video}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      )}
    </>
  );
};

export default RecipeInstructions;