import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaCarrot, FaPepperHot, FaAppleAlt, FaCheese, FaEgg, FaCoffee, 
  FaPizzaSlice, FaWineGlassAlt, FaLeaf, FaBreadSlice, FaIceCream 
} from 'react-icons/fa';
import { 
  GiCupcake, GiBowlOfRice, GiNoodles, GiSlicedBread, GiFrenchFries, 
  GiChopsticks, GiHamburger, GiTomato, GiGrapes, GiCheeseWedge, GiDonut
} from 'react-icons/gi';
import { BiDish } from 'react-icons/bi';

/**
 * Generate a random number between min and max (inclusive)
 */
const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

/**
 * Enhanced decorative background with animated food icons using Framer Motion
 */
const HeroBackground = () => {
  const [icons, setIcons] = useState([]);
  
  useEffect(() => {
    // All available food icons
    const iconComponents = [
      FaCarrot, FaPepperHot, FaAppleAlt, FaCheese, FaEgg, FaCoffee, 
      FaPizzaSlice, FaWineGlassAlt, FaLeaf, FaBreadSlice, FaIceCream,
      GiCupcake, GiBowlOfRice, GiNoodles, GiSlicedBread, GiFrenchFries, 
      GiChopsticks, GiHamburger, GiTomato, GiGrapes, GiCheeseWedge, GiDonut,
      BiDish
    ];
    
    // Colors matching our theme
    const colors = [
      '#F2CC8F', '#81B29A', '#E07A5F', '#F4F1DE', '#3D405B', 
      '#D8A48F', '#B6CEA5', '#F9DB95', '#DABEB6'
    ];
    
    // Create a comprehensive grid of icons
    const createGridIcons = () => {
      // 5x5 grid for better coverage (25 icons)
      const horizontalSections = 5;
      const verticalSections = 5;
      const gridIcons = [];
      
      // Create an icon for each cell in the grid
      for (let y = 0; y < verticalSections; y++) {
        for (let x = 0; x < horizontalSections; x++) {
          const IconComponent = iconComponents[random(0, iconComponents.length - 1)];
          
          // Calculate percentage positions
          const sectionWidth = 100 / horizontalSections;
          const sectionHeight = 100 / verticalSections;
          
          const leftPos = random(x * sectionWidth + 5, (x + 1) * sectionWidth - 5);
          const topPos = random(y * sectionHeight, (y + 1) * sectionHeight - 5);
          
          gridIcons.push({
            id: `grid-${y}-${x}`,
            icon: IconComponent,
            left: `${leftPos}%`,
            top: `${topPos}%`,
            size: random(24, 36),
            color: colors[random(0, colors.length - 1)],
            delay: random(0, 15) / 10,
            duration: random(30, 60) / 10,
            opacity: random(10, 25) / 100,
          });
        }
      }
      
      return gridIcons;
    };
    
    // Create specific icons for important areas
    const createSpecialIcons = () => {
      const specialIcons = [];
      
      // Top bar area (navigation)
      for (let i = 0; i < 3; i++) {
        const IconComponent = iconComponents[random(0, iconComponents.length - 1)];
        specialIcons.push({
          id: `top-${i}`,
          icon: IconComponent,
          left: `${random(10 + i * 30, 30 + i * 30)}%`,
          top: `${random(0, 10)}%`,
          size: random(18, 24), // Slightly smaller for nav area
          color: colors[random(0, colors.length - 1)],
          delay: random(0, 15) / 10,
          duration: random(30, 60) / 10,
          opacity: random(8, 15) / 100, // Less opacity for nav area
        });
      }
      
      // Bottom area
      for (let i = 0; i < 4; i++) {
        const IconComponent = iconComponents[random(0, iconComponents.length - 1)];
        specialIcons.push({
          id: `bottom-${i}`,
          icon: IconComponent,
          left: `${random(5 + i * 25, 20 + i * 25)}%`,
          top: `${random(90, 98)}%`,
          size: random(24, 32),
          color: colors[random(0, colors.length - 1)],
          delay: random(0, 15) / 10,
          duration: random(30, 60) / 10,
          opacity: random(10, 25) / 100,
        });
      }
      
      // Corners (especially lower right)
      const cornerPositions = [
        { id: 'top-left', x: [0, 10], y: [0, 10] },
        { id: 'top-right', x: [90, 98], y: [0, 10] },
        { id: 'bottom-left', x: [0, 10], y: [90, 98] },
        { id: 'bottom-right', x: [90, 98], y: [90, 98] }
      ];
      
      cornerPositions.forEach(corner => {
        const IconComponent = iconComponents[random(0, iconComponents.length - 1)];
        specialIcons.push({
          id: `corner-${corner.id}`,
          icon: IconComponent,
          left: `${random(corner.x[0], corner.x[1])}%`,
          top: `${random(corner.y[0], corner.y[1])}%`,
          size: random(24, 36),
          color: colors[random(0, colors.length - 1)],
          delay: random(0, 15) / 10,
          duration: random(30, 60) / 10,
          opacity: random(10, 25) / 100,
        });
      });
      
      return specialIcons;
    };
    
    // Combine all icons
    const allIcons = [
      ...createGridIcons(),
      ...createSpecialIcons()
    ];
    
    setIcons(allIcons);
  }, []);

  // Animation variants for the icons
  const floatingAnimation = {
    initial: (custom) => ({
      opacity: 0,
      scale: 0.5,
      y: 20,
    }),
    animate: (custom) => ({
      opacity: custom.opacity,
      scale: 1,
      y: [0, -15, 0, -10, 0],
      rotate: [0, 5, 0, -5, 0],
      transition: {
        delay: custom.delay,
        duration: custom.duration,
        repeat: Infinity,
        repeatType: 'reverse',
        ease: 'easeInOut',
      }
    })
  };

  return (
    <div className="fixed inset-0 overflow-hidden z-0 pointer-events-none">
      {/* Background with gradient */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-b from-[#3D405B] to-[#2D2A32] z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      />
      
      {/* Subtle pattern overlay with shimmer effect */}
      <motion.div 
        className="absolute inset-0 opacity-5 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMTAiIGN5PSIxMCIgcj0iMiIgZmlsbD0iI2ZmZiIvPjwvc3ZnPg==')]"
        animate={{ 
          opacity: [0.03, 0.05, 0.03],
          scale: [1, 1.02, 1]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          repeatType: 'reverse',
        }}
      />
      
      {/* Floating food icons */}
      {icons.map((item) => (
        <motion.div 
          key={item.id}
          className="absolute"
          style={{ 
            left: item.left, 
            top: item.top,
            color: item.color,
          }}
          custom={item}
          variants={floatingAnimation}
          initial="initial"
          animate="animate"
          whileHover={{ scale: 1.2, opacity: item.opacity + 0.1 }}
        >
          <item.icon size={item.size} />
        </motion.div>
      ))}
    </div>
  );
};

export default HeroBackground;