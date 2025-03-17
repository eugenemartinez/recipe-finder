import { useCallback } from 'react';

export const usePrintRecipe = () => {
  const printRecipe = useCallback((recipe, servings, adjustQuantity) => {
    const printContent = `
      <html>
        <head>
          <title>${recipe.title} Recipe</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              margin: 40px; 
              line-height: 1.6; 
              color: #333;
            }
            h1 { 
              margin-bottom: 5px; 
              color: #3D405B;
              font-size: 28px;
            }
            .meta { 
              color: #666; 
              margin-bottom: 20px; 
            }
            .servings { 
              margin: 15px 0; 
              font-weight: bold;
            }
            h2 { 
              margin-top: 30px; 
              border-bottom: 1px solid #eee; 
              padding-bottom: 5px;
              color: #81B29A;
            }
            ul { 
              padding-left: 20px; 
            }
            li { 
              margin-bottom: 8px; 
            }
            .instructions { 
              white-space: pre-line; 
            }
            .tags {
              margin-top: 30px;
              display: flex;
              flex-wrap: wrap;
            }
            .tag {
              background-color: #E07A5F;
              color: white;
              padding: 4px 10px;
              border-radius: 20px;
              margin-right: 8px;
              margin-bottom: 8px;
              font-size: 12px;
            }
            .footer {
              margin-top: 40px;
              border-top: 1px solid #eee;
              padding-top: 10px;
              color: #999;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <h1>${recipe.title}</h1>
          <div class="meta">${recipe.category || ''} ${recipe.category && recipe.area ? '|' : ''} ${recipe.area || ''}</div>
          <div class="servings">Servings: ${servings}</div>
          
          <h2>Ingredients</h2>
          <ul>
            ${recipe.ingredients.map(ingredient => `<li>${adjustQuantity(ingredient)}</li>`).join('')}
          </ul>
          
          <h2>Instructions</h2>
          <div class="instructions">${recipe.instructions}</div>
          
          <div class="tags">
            ${recipe.tags && recipe.tags.length ? recipe.tags.map(tag => `<span class="tag">${tag}</span>`).join('') : ''}
          </div>
          
          <div class="footer">
            Printed from Recipe Finder • ${new Date().toLocaleDateString()}
          </div>
        </body>
      </html>
    `;
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => printWindow.print(), 500);
  }, []);

  return { printRecipe };
};