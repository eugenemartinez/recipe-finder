import { useState } from 'react';

// Common fractions and their decimal equivalents for formatting
const commonFractions = [
  { decimal: 0.25, fraction: '1/4' },
  { decimal: 0.33, fraction: '1/3' },
  { decimal: 0.5, fraction: '1/2' },
  { decimal: 0.67, fraction: '2/3' },
  { decimal: 0.75, fraction: '3/4' },
  { decimal: 0.125, fraction: '1/8' },
  { decimal: 0.375, fraction: '3/8' },
  { decimal: 0.625, fraction: '5/8' },
  { decimal: 0.875, fraction: '7/8' }
];

// Parse quantities including fractions, mixed fractions, and decimals
const parseQuantity = (quantityStr) => {
  if (!quantityStr) return 0;
  
  // Handle mixed fractions like "1 1/2"
  if (quantityStr.includes(' ') && quantityStr.includes('/')) {
    const [whole, fraction] = quantityStr.split(' ');
    const [numerator, denominator] = fraction.split('/');
    return parseInt(whole) + (parseInt(numerator) / parseInt(denominator));
  }
  
  // Handle simple fractions like "1/2"
  if (quantityStr.includes('/')) {
    const [numerator, denominator] = quantityStr.split('/');
    return parseInt(numerator) / parseInt(denominator);
  }
  
  // Handle range like "1-2" (take average)
  if (quantityStr.includes('-')) {
    const [min, max] = quantityStr.split('-');
    return (parseFloat(min) + parseFloat(max)) / 2;
  }
  
  // Handle decimal or integer
  return parseFloat(quantityStr);
};

// Format a number as a fraction when appropriate
const formatQuantity = (value) => {
  if (isNaN(value)) return '0';
  
  // Extract the whole number part
  const wholePart = Math.floor(value);
  const decimalPart = parseFloat((value - wholePart).toFixed(3)); // Round to avoid floating point errors
  
  // If there's no decimal part, just return the whole number
  if (decimalPart === 0) return wholePart.toString();
  
  // Find the closest common fraction
  const closest = commonFractions.find(f => 
    Math.abs(f.decimal - decimalPart) < 0.03 // Tolerance of 0.03
  );
  
  if (closest) {
    // Format as mixed number if there's a whole part
    return wholePart > 0 ? `${wholePart} ${closest.fraction}` : closest.fraction;
  }
  
  // If it's not close to a common fraction, format as decimal
  // More precise for small values, less precise for larger values
  const formatted = value < 1 ? value.toFixed(2) : value.toFixed(1);
  return formatted.replace(/\.0+$/, ''); // Remove trailing zeros
};

export function useServingsCalculation(defaultServings = 4) {
  const [servings, setServings] = useState(defaultServings);
  const [recentlyUpdated, setRecentlyUpdated] = useState(false);

  const updateServings = (newServings) => {
    setServings(newServings);
    setRecentlyUpdated(true);
    setTimeout(() => setRecentlyUpdated(false), 500);
  };

  const adjustQuantity = (ingredient) => {
    // First try to match patterns with space between quantity and unit (original pattern)
    let regex = /^(\d+(?:\s+\d+\/\d+)?|\d+\/\d+|\d+\.\d+|\d+-\d+)\s+([a-zA-Z]+(?:\s+[a-zA-Z]+)?)?(.*)$/;
    let match = ingredient.match(regex);
    
    // If no match found, try matching without space between quantity and unit (e.g., "300g")
    if (!match) {
      regex = /^(\d+(?:\s+\d+\/\d+)?|\d+\/\d+|\d+\.\d+|\d+-\d+)([a-zA-Z]+)(.*)$/;
      match = ingredient.match(regex);
    }
    
    if (!match) return ingredient;
    
    const quantityStr = match[1];
    const unit = match[2] || '';
    const name = match[3] || '';
    
    // Parse the quantity and adjust based on servings ratio
    const quantity = parseQuantity(quantityStr);
    if (isNaN(quantity)) return ingredient;
    
    const adjustedQuantity = (quantity * servings) / defaultServings;
    
    // Format the adjusted quantity
    const formattedQuantity = formatQuantity(adjustedQuantity);
    
    // Reconstruct the ingredient string with proper spacing
    // If there was no space originally between quantity and unit (e.g., "300g"),
    // don't add a space in the output
    const hasSpace = ingredient.indexOf(unit) > quantityStr.length;
    return hasSpace 
      ? `${formattedQuantity} ${unit}${name}`
      : `${formattedQuantity}${unit}${name}`;
  };

  return { 
    servings, 
    updateServings, 
    adjustQuantity, 
    recentlyUpdated 
  };
}